import { StringInput } from "@/components/SchemaForm/StringInput"
import { cloneData } from "@/lib/clone"
import { fileToObjectUrl, makeDownloadFile, uploadFile, urlToBlob } from "@/lib/files"
import { buildAssetZipBlob, ZipReadResult } from "@/lib/zipFiles"
import { FileAsset } from "@/services/assets"
import { FileAssetService } from "@/services/FileAssetService"
import { Alert, Button, ButtonGroup, Grid, Snackbar, Typography } from "@mui/material"
import { FunctionComponent, useState } from "react"
import { EditorBox } from "../EditorBox"
import { EditorHeading } from "../EditorHeading"
import { FileAssetSelector } from "../FileAssetSelector"
import { AddIcon, ImageIcon, SoundIcon } from "../material-icons"
import { SaveButtons } from "./SaveButtons"
import { UploadAssetButtons } from "./UploadAssetButtons"
import { ZipFileControl } from "./ZipFileControl"


type AssetFormProps<AssetType extends FileAsset> = {
    asset: Partial<AssetType>;
    changeValue: { (mod: Partial<AssetType>): void }
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

enum Mode { EDIT = 'edit', CREATE = 'create' }

export const AssetManager = <AssetType extends FileAsset>({
    PreviewComponent,
    FormComponent,
    assetType,
    validateZipFile,
    validateAsset,
    service,
}: Props<AssetType>) => {

    const [mode, setMode] = useState<Mode>(Mode.CREATE)
    const [asset, setAsset] = useState<Partial<AssetType>>({})
    const [fileObjectUrl, setFileObjectUrl] = useState<string>()
    const [fileName, setFileName] = useState<string>()
    const [saveWarning, setSaveWarning] = useState<string>()
    const [uploadWarning, setUploadWarning] = useState<string>()

    const revokeAndSetFileObjectUrl = (newUrl: string | undefined) => {
        if (fileObjectUrl && typeof window !== undefined) {
            window.URL.revokeObjectURL(fileObjectUrl);
        }
        setFileObjectUrl(newUrl);
    }

    const openFromService = (asset: FileAsset) => {
        setMode(Mode.EDIT)
        revokeAndSetFileObjectUrl(undefined)
        setAsset(cloneData(asset as AssetType))
    }

    const setNewFile = (file: Blob | File, newFileName: string) => {
        const shouldReplaceId = mode === Mode.CREATE && (!asset.id || asset.id === fileName)
        revokeAndSetFileObjectUrl(fileToObjectUrl(file));
        setFileName(newFileName)
        setSaveWarning(undefined)
        if (shouldReplaceId) {
            setAsset(({ ...asset, id: newFileName }))
        }
    }

    const clearFile = () => {
        revokeAndSetFileObjectUrl(undefined)
        setFileName(undefined)
    }

    const loadUrl = async (url: string) => {
        const validateAs = assetType === 'sound' ? 'audio' : assetType;
        const { blob, failure } = await urlToBlob(url, validateAs)
        if (!blob) {
            setUploadWarning(`failed to load ${assetType} URL: ${failure ?? ''}`)
            return
        }
        setNewFile(blob, url.split('/').pop() ?? url)
    };

    const loadFile = async () => {
        const file = await uploadFile();
        if (!file) {
            setUploadWarning(`failed to upload ${assetType} file`)
            return;
        }
        setNewFile(file, file.name)
    }

    const startNewAsset = () => {
        revokeAndSetFileObjectUrl(undefined);
        setFileName(undefined)
        setMode(Mode.CREATE)
        setAsset({})
    }

    const saveAssetChanges = () => {
        setSaveWarning(undefined)

        if (!fileObjectUrl && !asset.href) {
            setSaveWarning('no file')
            return
        }
        const copy = fileObjectUrl
            ? { ...asset, href: fileObjectUrl, originalFileName: fileName }
            : { ...asset }
        const isValid = validateAsset(copy);
        if (!isValid) {
            setSaveWarning('invalid data')
            return
        }
        service.add(copy)
        setAsset(copy)
        setMode(Mode.EDIT)
        setFileName(undefined)
        if (copy.href === fileObjectUrl) {
            setFileObjectUrl(undefined)
        } else {
            revokeAndSetFileObjectUrl(undefined)
        }
    }

    return (
        <article>
            <EditorHeading
                heading={`${assetType} assets`}
                icon={icons[assetType]}
                itemId={mode === Mode.EDIT ? asset.id : '[new asset]'}
            />
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
                    onClick={startNewAsset}>
                    build new asset
                </Button>
            </ButtonGroup>

            <Grid container spacing={1} justifyContent={'space-between'}>
                <Grid item display={'flex'} flexWrap={'wrap'}>
                    <div>
                        <EditorBox title="Asset Properties">
                            <StringInput label="id"
                                value={asset.id ?? ''}
                                readOnly={mode === Mode.EDIT}
                                inputHandler={id => setAsset(asset => ({ ...asset, id }))} />
                            <StringInput label="original file name"
                                value={asset.originalFileName ?? ''}
                                readOnly={true}
                                inputHandler={() => { }} />
                            <FormComponent
                                asset={asset}
                                changeValue={(mod) => {
                                    setAsset((asset) => ({ ...asset, ...mod }))
                                }}
                            />
                            <SaveButtons
                                mode={mode}
                                idIsValid={!!asset.id && asset.id.length > 0}
                                idIsAlreadyTaken={asset.id ? service.list().includes(asset.id) : false}
                                saveAssetChanges={saveAssetChanges}
                            />
                        </EditorBox>
                        <EditorBox title="Temporary file">
                            <Typography textAlign={'center'}
                                marginY={2}
                            >{!!fileObjectUrl ? fileName : '[no file]'}</Typography>
                            <ButtonGroup orientation="vertical" fullWidth>
                                <UploadAssetButtons
                                    fileDescription={assetType}
                                    loadFile={loadFile}
                                    loadUrl={loadUrl} />
                                <Button
                                    disabled={!fileObjectUrl}
                                    onClick={clearFile}
                                >clear file</Button>
                            </ButtonGroup>
                        </EditorBox>
                    </div>
                    <PreviewComponent
                        asset={asset}
                        temporarySrc={fileObjectUrl}
                        temporaryFileName={fileName} />
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