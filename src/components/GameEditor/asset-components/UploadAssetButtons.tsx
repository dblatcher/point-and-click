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
                title={`upload ${fileDescription} file`}
                startIcon={<UploadIcon />}
                onClick={loadFile}>
                upload
            </Button>
            <ButtonWithTextInput
                buttonProps={{
                    variant: "outlined",
                    startIcon: < LinkIcon />,
                    title:`get ${fileDescription} file from URL`,
                }}
                label={'from url'}
                onEntry={(input) => { loadUrl(input) }}
                dialogTitle={`enter ${fileDescription} url`} />
        </>
    )
}