import { cloneData } from "@/lib/clone"
import { fileToObjectUrl, makeDownloadFile, uploadFile, urlToBlob } from "@/lib/files"
import { buildAssetZipBlob, ZipReadResult } from "@/lib/zipFiles"
import { FileAsset } from "@/services/assets"
import { FileAssetService } from "@/services/FileAssetService"
import { Alert, Box, Button, ButtonGroup, Grid, Snackbar, Typography } from "@mui/material"
import { FunctionComponent, useRef, useState } from "react"
import { EditorHeading } from "../EditorHeading"
import { FileAssetSelector } from "../FileAssetSelector"
import { AddIcon, ImageIcon, SoundIcon } from "../material-icons"
import { ZipFileControl } from "./ZipFileControl"
import { UploadAssetButtons } from "./UploadAssetButtons"
import { SaveButtons } from "./SaveButtons"


type AssetFormProps<AssetType extends FileAsset> = {
    asset: Partial<AssetType>;
    changeValue: { (mod: Partial<AssetType>): void }
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
    service: FileAssetService<AssetType>;
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
    service,
}: Props<AssetType>) => {

    const [asset, setAsset] = useState<Partial<AssetType>>({})
    const [fileObjectUrl, setFileObjectUrl] = useState<string>()
    const [saveWarning, setSaveWarning] = useState<string>()
    const [uploadWarning, setUploadWarning] = useState<string>()
    const fileRef = useRef<File | Blob | null>(null)

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

        // to do - should this happen?
        // cannot change the file on an asset without changing id
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

    const loadFile = async () => {
        const file = await uploadFile();
        if (!file) {
            setUploadWarning(`failed to upload ${assetType} file`)
            return;
        }
        setNewFile(file)
    }

    const saveAssetChanges = () => {
        const newHref = fileRef.current ? fileToObjectUrl(fileRef.current) : undefined;
        if (!newHref && !asset.href) {
            setSaveWarning('no file')
            return
        }
        const copy = {
            ...asset,
            href: asset.href ?? newHref
        }
        const isValid = validateAsset(copy);
        if (!isValid) {
            setSaveWarning('invalid data')
            return
        }
        setSaveWarning(undefined)
        service.add(copy)
        setAsset(copy)
    }

    const fileState = !!fileObjectUrl ? 'temp file uploaded' : asset.href ? 'file in service' : 'no file'

    return (
        <article>
            <EditorHeading heading={`${assetType} asset tool`} icon={icons[assetType]} />
            <ButtonGroup sx={{ marginY: 2 }}>
                <ZipFileControl
                    zipAssets={async () => {
                        const blobName = assetType === 'image' ? 'images' : 'sounds';
                        const result = await buildAssetZipBlob(blobName, service);
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
                />
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        if (fileObjectUrl && typeof window !== undefined) {
                            window.URL.revokeObjectURL(fileObjectUrl);
                        }
                        fileRef.current = null
                        setFileObjectUrl(undefined)
                        setAsset({})
                    }}>
                    build new asset
                </Button>

            </ButtonGroup>

            <Grid container spacing={1} justifyContent={'space-between'}>
                <Grid item>
                    <FormComponent
                        asset={asset}
                        changeValue={(mod) => {
                            setAsset((asset) => ({ ...asset, ...mod }))
                        }}
                        hasFile={!!fileObjectUrl}
                    />
                    <ButtonGroup orientation="vertical">
                        <SaveButtons
                            isNewAsset={asset.id ? !service.list().includes(asset.id) : true}
                            saveAssetChanges={saveAssetChanges}
                        />
                        <UploadAssetButtons
                            fileDescription={assetType}
                            loadFile={loadFile}
                            loadUrl={loadUrl} />
                    </ButtonGroup>

                    <Typography>{fileState}</Typography>
                </Grid>
                <Grid item>
                    <PreviewComponent asset={asset} temporarySrc={fileObjectUrl} />
                </Grid>
                <Grid item>
                    <FileAssetSelector assetType={assetType}
                        legend="assets"
                        currentSelection={asset?.id}
                        select={openFromService} />
                </Grid>
            </Grid>

            <Snackbar open={!!uploadWarning} autoHideDuration={5000} onClose={() => setUploadWarning(undefined)}>
                <Alert severity="error">{uploadWarning}</Alert>
            </Snackbar>
            <Snackbar open={!!saveWarning} autoHideDuration={5000} onClose={() => setSaveWarning(undefined)}>
                <Alert severity="error">{saveWarning}</Alert>
            </Snackbar>
        </article >
    )
}