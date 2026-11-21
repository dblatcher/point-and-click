import { Button } from "@mui/material";
import { ButtonWithTextInput } from "../ButtonWithTextInput";
import { LinkIcon, UploadIcon } from "../material-icons";
import { checkMimeType, uploadFile, urlToBlob } from "@/lib/files";
import { AssetType } from "@/services/assets";

interface Props {
    setUploadWarning: { (input: string): void }
    assetType: AssetType;
    setNewFile: { (file: Blob | File, newFileName: string): void }
}


export const UploadAssetButtons = ({
    assetType,
    setUploadWarning,
    setNewFile,
}: Props) => {
    const validateAs = assetType === 'sound' ? 'audio' : assetType;

    const loadFile = async () => {
        const file = await uploadFile(validateAs);
        if (!file) {
            setUploadWarning(`failed to upload ${assetType} file`)
            return;
        }
        const wrongTypeFailure = checkMimeType(validateAs, file);
        if (wrongTypeFailure) {
            setUploadWarning(wrongTypeFailure.failure)
            return
        }

        setNewFile(file, file.name)
    }

    const loadUrl = async (url: string) => {
        const { blob, failure } = await urlToBlob(url, validateAs)
        if (!blob) {
            setUploadWarning(`failed to load ${assetType} URL: ${failure ?? ''}`)
            return
        }
        setNewFile(blob, url.split('/').pop() ?? url)
    };

    return (
        <>
            <Button variant="outlined"
                title={`upload ${assetType} file`}
                startIcon={<UploadIcon />}
                onClick={loadFile}>
                upload
            </Button>
            <ButtonWithTextInput
                buttonProps={{
                    variant: "outlined",
                    startIcon: < LinkIcon />,
                    title: `get ${assetType} file from URL`,
                }}
                label={'from url'}
                onEntry={(input) => { loadUrl(input) }}
                dialogTitle={`enter ${assetType} url`} />
        </>
    )
}