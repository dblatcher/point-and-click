import { AssetContextProps, useAssets } from "@/context/asset-context"
import { cloneData } from "@/lib/clone"
import { fileToObjectUrl, makeDownloadFile, uploadFile, urlToBlob } from "@/lib/files"
import { buildAssetZipBlob, ZipReadResult } from "@/lib/zipFiles"
import { FileAsset } from "@/services/assets"
import { FileAssetService } from "@/services/FileAssetService"
import { ImageService } from "@/services/imageService"
import { SoundService } from "@/services/soundService"
import { Alert, Grid } from "@mui/material"
import { FunctionComponent, useRef, useState } from "react"
import { EditorHeading } from "../EditorHeading"
import { FileAssetSelector } from "../FileAssetSelector"
import { ImageIcon, SoundIcon } from "../material-icons"
import { ZipFileControl } from "./ZipFileControl"


type AssetFormProps<AssetType extends FileAsset> = {
    asset: Partial<AssetType>;
    changeValue: { (mod: Partial<AssetType>): void }
    loadFile: { (): Promise<void> }
    loadUrl: { (input: string): Promise<void> }
    isNewAsset: boolean
    saveAssetChanges: { (): void }
    saveWarning?: string
    hasFile: boolean;
}

type Props<AssetType extends FileAsset> = {
    PreviewComponent: FunctionComponent<{
        asset: Partial<AssetType>
        temporarySrc?: string
        temporaryFileName?: string
    }>;
    FormComponent: FunctionComponent<AssetFormProps<AssetType>>;
    assetType: 'sound' | 'image';
    validateZipFile: { (file: Blob): Promise<ZipReadResult<AssetType[]>> }
    validateAsset: { (asset: unknown): asset is AssetType }
}

const getServiceAndAssets = <AssetType extends FileAsset>(assetType: 'sound' | 'image', context: AssetContextProps): FileAssetService<AssetType> => {
    switch (assetType) {
        case "sound":
            return context.soundService as unknown as FileAssetService<AssetType>
        case "image":
            return context.imageService as unknown as FileAssetService<AssetType>
    }
}

const icons = {
    sound: SoundIcon,
    image: ImageIcon
}

export const AssetManager = <AssetType extends FileAsset>({
    PreviewComponent,
    FormComponent,
    assetType,
    validateZipFile,
    validateAsset,
}: Props<AssetType>) => {

    const [asset, setAsset] = useState<Partial<AssetType>>({})
    const [fileObjectUrl, setFileObjectUrl] = useState<string>()
    const [saveWarning, setSaveWarning] = useState<string>()
    const [uploadWarning, setUploadWarning] = useState<string>()
    const fileRef = useRef<File | Blob | null>(null)
    const assetContext = useAssets();
    const service = getServiceAndAssets(assetType, assetContext)

    const openFromService = (asset: FileAsset) => {
        const assetCopy = cloneData(asset as AssetType);
        fileRef.current = null
        if (fileObjectUrl && typeof window !== undefined) {
            window.URL.revokeObjectURL(fileObjectUrl);
        }
        setFileObjectUrl(undefined)
        setAsset(assetCopy)
    }

    const setNewFile = (file: Blob | File) => {
        fileRef.current = file
        const newUrl = fileToObjectUrl(file);

        if (fileObjectUrl && typeof window !== undefined) {
            window.URL.revokeObjectURL(fileObjectUrl);
        }

        setAsset({
            id: file.name ?? asset.id,
            originalFileName: file.name,
        } as Partial<AssetType>)

        setSaveWarning(undefined)
        setFileObjectUrl(newUrl)
    }

    const loadUrl = async (url: string) => {
        const validateAs = assetType === 'sound' ? 'audio' : assetType;
        const { blob, failure } = await urlToBlob(url, validateAs)
        if (!blob) {
            setUploadWarning(`failed to load ${assetType} URL: ${failure ?? ''}`)
            return
        }
        setNewFile(blob)
    };


    return (
        <article>
            <EditorHeading heading={`${assetType} asset tool`} icon={icons[assetType]} />
            <ZipFileControl
                zipAssets={async () => {
                    const blobName = assetType === 'image' ? 'images' : 'sounds';
                    const result = await buildAssetZipBlob(blobName, service as ImageService | SoundService);
                    if (result.success === false) {
                        setSaveWarning(result.error)
                        return
                    }
                    makeDownloadFile(`${blobName}.zip`, result.blob);
                }}
                loadFromZipFile={async () => {
                    setUploadWarning(undefined)

                    const file = await uploadFile();
                    if (!file) {
                        return;
                    }
                    const result = await validateZipFile(file);
                    if (!result.success) {
                        setUploadWarning(result.error)
                        return
                    }
                    service.add(result.data)

                }}
                clearForm={() => {
                    if (fileObjectUrl && typeof window !== undefined) {
                        window.URL.revokeObjectURL(fileObjectUrl);
                    }
                    fileRef.current = null
                    setFileObjectUrl(undefined)
                    setAsset({})
                }}
                clearWarning={() => setSaveWarning(undefined)}
            />

            <Grid container spacing={1} justifyContent={'space-between'}>
                <Grid item>
                    {!!saveWarning && <Alert severity="warning">{saveWarning}</Alert>}
                    {!!uploadWarning && <Alert severity="warning">{uploadWarning}</Alert>}

                    <FormComponent
                        asset={asset}
                        changeValue={(mod) => {
                            setAsset((asset) => ({ ...asset, ...mod }))
                        }}
                        loadFile={async () => {
                            const file = await uploadFile();
                            if (!file) {
                                setUploadWarning(`failed to upload ${assetType} file`)
                                return;
                            }
                            setNewFile(file)
                        }}
                        loadUrl={loadUrl}
                        isNewAsset={asset.id ? !service.list().includes(asset.id) : true}
                        saveAssetChanges={() => {
                            const newHref = fileRef.current ? fileToObjectUrl(fileRef.current) : undefined;
                            if (!newHref) {
                                setSaveWarning('no file')
                                return
                            }
                            const copy = {
                                ...asset,
                                href: newHref
                            }
                            const isValid = validateAsset(copy);
                            if (!isValid) {
                                setSaveWarning('invalid data')
                                return
                            }
                            setSaveWarning(undefined)
                            service.add(copy)

                        }}
                        hasFile={!!fileObjectUrl} />
                    <PreviewComponent asset={{ href: fileObjectUrl, ...asset, }} />
                </Grid>
                <Grid item>
                    <FileAssetSelector assetType={assetType}
                        legend="assets"
                        currentSelection={asset?.id}
                        select={openFromService} />
                </Grid>

            </Grid>
        </article>
    )
}