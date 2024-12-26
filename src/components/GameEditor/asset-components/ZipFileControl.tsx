import { AddIcon, DownloadIcon, UploadIcon } from "@/components/GameEditor/material-icons";
import { Alert, Button, Snackbar, Stack } from "@mui/material";
import { EditorBox } from "../EditorBox";


interface Props {
    zipAssets: { (): Promise<void> },
    loadFromZipFile: { (): Promise<void> },
    uploadWarning?: string
    clearForm: { (): void }
    clearWarning: { (): void }
}


export const ZipFileControl = ({ zipAssets, loadFromZipFile, uploadWarning, clearForm, clearWarning }: Props) => {
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

            <Snackbar open={!!uploadWarning} autoHideDuration={5000} onClose={() => { }}>
                <Alert severity="error">{uploadWarning}</Alert>
            </Snackbar>
        </EditorBox>
    )
}