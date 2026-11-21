import { StringInput } from "@/components/SchemaForm/StringInput"
import { cloneData } from "@/lib/clone"
import { fileToObjectUrl, makeDownloadFile, uploadFile } from "@/lib/files"
import { buildAssetZipBlob, ZipReadResult } from "@/lib/zipFiles"
import { AssetType, FileAsset } from "@/services/assets"
import { FileAssetService } from "@/services/FileAssetService"
import { Alert, Box, Button, ButtonGroup, Snackbar, useTheme } from "@mui/material"
import { FunctionComponent, useState } from "react"
import { EditorBox } from "../layout/EditorBox"
import { EditorHeading } from "../layout/EditorHeading"
import { AddIcon, ImageIcon, SoundIcon } from "../material-icons"
import { FileAssetList } from "./FileAssetList"
import { SaveButtons } from "./SaveButtons"
import { UploadAssetButtons } from "./UploadAssetButtons"
import { ZipFileControl } from "./ZipFileControl"


type AssetFormProps<TypedAsset extends FileAsset> = {
    asset: Partial<TypedAsset>;
    changeValue: { (mod: Partial<TypedAsset>): void }
}

type Props<TypedAsset extends FileAsset> = {
    PreviewComponent: FunctionComponent<{
        asset: Partial<TypedAsset>
        temporarySrc?: string
        temporaryFileName?: string
    }>;
    FormComponent: FunctionComponent<AssetFormProps<TypedAsset>>;
    assetType: AssetType;
    validateZipFile: { (file: Blob): Promise<ZipReadResult<TypedAsset[]>> }
    validateAsset: { (asset: unknown): asset is TypedAsset }
    service: FileAssetService<TypedAsset>;
}


const icons = {
    sound: SoundIcon,
    image: ImageIcon
}

enum Mode { EDIT = 'edit', CREATE = 'create' }

export const AssetManager = <TypedAsset extends FileAsset>({
    PreviewComponent,
    FormComponent,
    assetType,
    validateZipFile,
    validateAsset,
    service,
}: Props<TypedAsset>) => {
    const theme = useTheme();
    const [mode, setMode] = useState<Mode>(Mode.CREATE)
    const [asset, setAsset] = useState<Partial<TypedAsset>>({})
    const [fileObjectUrl, setFileObjectUrl] = useState<string>()
    const [fileName, setFileName] = useState<string>()
    const [downloadWarning, setDownloadWarning] = useState<string>()
    const [uploadWarning, setUploadWarning] = useState<string>()

    const fileNameDisplay = (fileObjectUrl && fileName)
        ? fileName
        : mode === Mode.CREATE
            ? '[no file]'
            : asset.originalFileName ?? '[no file]'


    const revokeAndSetFileObjectUrl = (newUrl: string | undefined) => {
        if (fileObjectUrl && typeof window !== undefined) {
            window.URL.revokeObjectURL(fileObjectUrl);
        }
        setFileObjectUrl(newUrl);
    }

    const openFromService = (asset: FileAsset) => {
        setMode(Mode.EDIT)
        revokeAndSetFileObjectUrl(undefined)
        setAsset(cloneData(asset as TypedAsset))
    }

    const setNewFile = (file: Blob | File, newFileName: string) => {
        const shouldReplaceId = mode === Mode.CREATE && (!asset.id || asset.id === fileName)
        revokeAndSetFileObjectUrl(fileToObjectUrl(file));
        setFileName(newFileName)
        if (shouldReplaceId) {
            setAsset(({ ...asset, id: newFileName, size: file.size }))
        }
    }

    const clearFile = () => {
        revokeAndSetFileObjectUrl(undefined)
        setFileName(undefined)
    }


    const startNewAsset = () => {
        revokeAndSetFileObjectUrl(undefined);
        setFileName(undefined)
        setMode(Mode.CREATE)
        setAsset({})
    }

    const buildAsset = (): { success: false, warning: string } | { success: true, data: TypedAsset } => {
        if (!fileObjectUrl && !asset.href) {
            return { success: false, warning: 'no file' }
        }
        const copy = fileObjectUrl
            ? { ...asset, href: fileObjectUrl, originalFileName: fileName }
            : { ...asset }
        const isValid = validateAsset(copy);
        if (!isValid) {
            return { success: false, warning: 'invalid data' }
        }
        return { success: true, data: copy }
    }

    const saveAssetChanges = (asset: TypedAsset) => {
        service.add(asset)
        setAsset(asset)
        setMode(Mode.EDIT)
        setFileName(undefined)
        if (asset.href === fileObjectUrl) {
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
            >
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={startNewAsset}>
                    build new asset
                </Button>
            </EditorHeading>
            <ButtonGroup sx={{ marginBottom: 2 }}>
                <ZipFileControl
                    zipAssets={async () => {
                        const blobName = assetType === 'image' ? 'images' : 'sounds';
                        const result = await buildAssetZipBlob(blobName, service);
                        if (result.success === false) {
                            setDownloadWarning(result.error)
                            return
                        }
                        makeDownloadFile(`${blobName}.zip`, result.blob);
                    }}
                    loadFromZipFile={async () => {
                        setUploadWarning(undefined)
                        const file = await uploadFile('zip');
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

            </ButtonGroup>
            <Box sx={{
                gap: 5,
                display: 'grid',
                gridTemplateColumns: 'fit-content(260px) 1fr 320px ',
                gridTemplateRows: "1fr",
                gridTemplateAreas: `
                    "list preview edit"`,
                [theme.breakpoints.down('lg')]: {
                    gridTemplateColumns: 'fit-content(210px) 1fr',
                    gridTemplateRows: "auto 1fr",
                    gridTemplateAreas: `
                    "list preview"
                    "list edit"`,
                },
                [theme.breakpoints.down('md')]: {
                    gridTemplateColumns: '1fr',
                    gridTemplateRows: "auto",
                    gridTemplateAreas: `
                    "list"
                    "preview"
                    "edit"`,
                }
            }}>
                <div style={{ gridArea: 'list' }}>
                    <FileAssetList assetType={assetType}
                        legend="assets"
                        currentSelection={asset?.id}
                        select={openFromService} />
                </div>
                <div style={{ gridArea: 'edit' }}>
                    <EditorBox title="Asset Properties">
                        <StringInput label="id"
                            value={asset.id ?? ''}
                            readOnly={mode === Mode.EDIT}
                            inputHandler={id => setAsset(asset => ({ ...asset, id }))} />
                        <Box paddingY={3}>
                            <StringInput label="file"
                                value={fileNameDisplay}
                                readOnly={true}
                                inputHandler={() => { }} />
                            <UploadAssetButtons
                                assetType={assetType}
                                setUploadWarning={setUploadWarning}
                                setNewFile={setNewFile}
                            />
                            <Button variant="outlined"
                                disabled={!fileObjectUrl}
                                onClick={clearFile}
                            >clear</Button>
                        </Box>


                        <FormComponent
                            asset={asset}
                            changeValue={(mod) => {
                                setAsset((asset) => ({ ...asset, ...mod }))
                            }}
                        />
                        <SaveButtons
                            assetType={assetType}
                            mode={mode}
                            asset={asset}
                            saveAssetChanges={saveAssetChanges}
                            buildAsset={buildAsset}
                        />
                    </EditorBox>
                </div>
                <div style={{ gridArea: 'preview' }}>
                    <PreviewComponent
                        asset={asset}
                        temporarySrc={fileObjectUrl}
                        temporaryFileName={fileName} />
                </div>
            </Box>

            <Snackbar open={!!uploadWarning} autoHideDuration={5000} onClose={() => setUploadWarning(undefined)}>
                <Alert severity="error">{uploadWarning}</Alert>
            </Snackbar>
            <Snackbar open={!!downloadWarning} autoHideDuration={5000} onClose={() => setDownloadWarning(undefined)}>
                <Alert severity="error">{downloadWarning}</Alert>
            </Snackbar>
        </article >
    )
}