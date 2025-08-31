import { AddIcon, DownloadIcon, UploadIcon } from "@/components/GameEditor/material-icons";
import { Alert, Button, Snackbar } from "@mui/material";


interface Props {
    zipAssets: { (): Promise<void> },
    loadFromZipFile: { (): Promise<void> },
}


export const ZipFileControl = ({ zipAssets, loadFromZipFile }: Props) => {
    return (
        <>
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
        </>
    )
}