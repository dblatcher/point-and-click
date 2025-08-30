import { OptionalNumberInput } from "@/components/SchemaForm/OptionalNumberInput";
import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { StringInput } from "@/components/SchemaForm/StringInput";
import { ImageAsset, imageAssetCategories, ImageAssetCategory } from "@/services/assets";
import { Box, Button, Stack } from "@mui/material";
import { EditorBox } from "../EditorBox";
import { SaveButtonsAndWarning } from "../asset-components/SaveButtonsAndWarning";
import { LinkIcon, UploadIcon } from "../material-icons";
import { ButtonWithTextInput } from "../ButtonWithTextInput";

interface Props {
    asset: Partial<ImageAsset>;
    changeValue: { (mod: Partial<ImageAsset>): void }
    loadFile: { (): Promise<void> }
    loadUrl: { (input: string): Promise<void> }
    isNewAsset: boolean
    saveAssetChanges: { (): void }
    saveWarning?: string
}


export const ImageAssetForm = ({ asset: imageAsset, changeValue, loadFile, isNewAsset, saveAssetChanges, saveWarning, loadUrl }: Props) => {
    return (
        <EditorBox title="Asset Properties" boxProps={{ marginBottom: 1 }}>
            <Stack spacing={2}>
                <StringInput
                    value={imageAsset.id ?? ''}
                    label="ID"
                    inputHandler={(value) => { changeValue({ 'id': value }) }}
                />
                <SelectInput optional
                    value={imageAsset.category}
                    label="category"
                    inputHandler={(value) => { changeValue({ 'category': value as ImageAssetCategory }) }}
                    options={imageAssetCategories}
                />
                <Stack direction={'row'}>
                    <OptionalNumberInput
                        value={imageAsset.rows}
                        label="rows"
                        inputHandler={(rows) => { changeValue({ rows }) }}
                        min={1}
                    />
                    <OptionalNumberInput
                        value={imageAsset.cols}
                        label="cols"
                        inputHandler={(cols) => { changeValue({ cols }) }}
                        min={1}
                    />
                </Stack>
                <Stack direction={'row'}>
                    <OptionalNumberInput
                        value={imageAsset.widthScale}
                        label="widthScale"
                        inputHandler={(widthScale) => { changeValue({widthScale}) }}
                        step={.1}
                    />
                    <OptionalNumberInput
                        value={imageAsset.heightScale}
                        label="heightScale"
                        inputHandler={(heightScale) => { changeValue({heightScale}) }}
                        step={.1}
                    />
                </Stack>
            </Stack>

            <Box display={'flex'} justifyContent={'flex-end'} paddingTop={2}>
                <Button variant="outlined"
                    startIcon={<UploadIcon />}
                    onClick={loadFile}>
                    upload image file
                </Button>
                <ButtonWithTextInput
                    buttonProps={{
                        variant: "outlined",
                        startIcon: < LinkIcon />
                    }}
                    label="get image from URL"
                    onEntry={(input) => { loadUrl(input) }}
                    dialogTitle="enter image url" />
            </Box>

            <SaveButtonsAndWarning {...{
                isNewAsset,
                saveAssetChanges,
                saveWarning
            }} />
        </EditorBox>
    )
}