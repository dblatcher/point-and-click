import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { StringInput } from "@/components/SchemaForm/StringInput";
import {
    SoundAsset, soundAssetCategories
} from "@/services/assets";
import { Box, Button, Checkbox, Stack, Typography } from "@mui/material";
import { EditorBox } from "../EditorBox";
import { SaveButtonsAndWarning } from "../asset-components/SaveButtonsAndWarning";
import { LinkIcon, UploadIcon } from "../material-icons";
import { ButtonWithTextInput } from "../ButtonWithTextInput";

interface Props {
    soundAsset: Partial<SoundAsset>;
    changeValue: { (propery: keyof SoundAsset, newValue: string | number | undefined): void }
    loadFile: { (): Promise<void> }
    loadUrl: { (input: string): Promise<void> }
    isNewAsset: boolean
    saveAssetChanges: { (): void }
    saveWarning?: string
    hasFile: boolean;
}


export const SoundAssetForm = ({ soundAsset, changeValue, loadFile, isNewAsset, saveAssetChanges, saveWarning, loadUrl, hasFile }: Props) => {
    return (
        <EditorBox title="Asset Properties" boxProps={{ marginBottom: 1 }}>
            <Stack spacing={2}>
                <StringInput
                    value={soundAsset.id ?? ''}
                    label="ID"
                    inputHandler={(value) => { changeValue('id', value) }}
                />
                <SelectInput optional
                    value={soundAsset.category}
                    label="category"
                    inputHandler={(value) => { changeValue('category', value) }}
                    options={soundAssetCategories}
                />
            </Stack>


            <Box display={'flex'} justifyContent={'flex-end'} paddingTop={2}>
                <Box display={'flex'} marginRight={'auto'} alignItems={'center'}>
                    <Typography>file:</Typography>
                    <Checkbox checked={hasFile} readOnly />
                </Box>

                <Button variant="outlined"
                    startIcon={<UploadIcon />}
                    onClick={loadFile}>
                    upload sound file
                </Button>
                <ButtonWithTextInput
                    buttonProps={{
                        variant: "outlined",
                        startIcon: < LinkIcon />
                    }}
                    label="get audio from URL"
                    onEntry={(input) => { loadUrl(input) }}
                    confirmationText="enter audio url" />
            </Box>

            <SaveButtonsAndWarning {...{
                isNewAsset,
                saveAssetChanges,
                saveWarning
            }} />
        </EditorBox>
    )
}