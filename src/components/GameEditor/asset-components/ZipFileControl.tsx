import { AddIcon, DownloadIcon, UploadIcon } from "@/components/GameEditor/material-icons";
import { Alert, Button, Stack } from "@mui/material";
import { EditorBox } from "../EditorBox";


interface Props {
    zipAssets: { (): Promise<void> },
    loadFromZipFile: { (): Promise<void> },
    uploadWarning?: string
    clearForm: { (): void }
}


export const ZipFileControl = ({ zipAssets, loadFromZipFile, uploadWarning, clearForm }: Props) => {
    return (
        <EditorBox boxProps={{ marginBottom: 1 }}>
            <Stack direction={'row'} spacing={1}>
                <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={zipAssets}>
                    zip all assets
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    onClick={loadFromZipFile}>
                    load assets from zip file
                </Button>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={clearForm}>
                    build new asset
                </Button>
            </Stack>
            {uploadWarning && <Alert severity="error">{uploadWarning}</Alert>}
        </EditorBox>
    )
}