import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from "@mui/icons-material/Upload";
import { Alert, Button, Stack } from "@mui/material";
import { EditorBox } from "../EditorBox";

interface Props {
    zipAssets: { (): Promise<void> },
    loadFromZipFile: { (): Promise<void> },
    uploadWarning?: string
}


export const ZipFileControl = ({ zipAssets, loadFromZipFile, uploadWarning }: Props) => {
    return (
        <EditorBox title="zip file" boxProps={{ marginBottom: 1 }}>
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
                {uploadWarning && <Alert severity="error">{uploadWarning}</Alert>}
            </Stack>
        </EditorBox>
    )
}