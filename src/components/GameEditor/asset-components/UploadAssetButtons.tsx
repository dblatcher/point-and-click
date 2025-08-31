import { Button } from "@mui/material";
import { ButtonWithTextInput } from "../ButtonWithTextInput";
import { LinkIcon, UploadIcon } from "../material-icons";

interface Props {
    fileDescription: string;
    loadFile: { (): Promise<void> }
    loadUrl: { (input: string): Promise<void> }
}


export const UploadAssetButtons = ({ fileDescription, loadFile, loadUrl }: Props) => {
    return (
        <>
            <Button variant="outlined"
                startIcon={<UploadIcon />}
                onClick={loadFile}>
                upload {fileDescription} file
            </Button>
            <ButtonWithTextInput
                buttonProps={{
                    variant: "outlined",
                    startIcon: < LinkIcon />
                }}
                label={`get ${fileDescription} file from URL`}
                onEntry={(input) => { loadUrl(input) }}
                dialogTitle={`enter ${fileDescription} url`} />
        </>
    )
}