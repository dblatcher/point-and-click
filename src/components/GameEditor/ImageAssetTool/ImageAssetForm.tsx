import { OptionalNumberInput } from "@/components/SchemaForm/OptionalNumberInput";
import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { StringInput } from "@/components/SchemaForm/StringInput";
import {
    ImageAsset, imageAssetCategories
} from "@/services/imageService";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from "@mui/icons-material/Upload";
import { Alert, Box, Button, Stack } from "@mui/material";
import { EditorBox } from "../EditorBox";

interface Props {
    imageAsset: Partial<ImageAsset>;
    changeValue: { (propery: keyof ImageAsset, newValue: string | number | undefined): void }
    loadFile: { (): Promise<void> }
    isNewAsset: boolean
    saveAssetChanges: { (): void }
    saveWarning?: string
}


export const ImageAssetForm = ({ imageAsset, changeValue, loadFile, isNewAsset, saveAssetChanges, saveWarning }: Props) => {
    return (
        <EditorBox title="Asset Properties" boxProps={{ marginBottom: 1 }}>

            <Stack spacing={2}>
                <StringInput
                    value={imageAsset.id ?? ''}
                    label="ID"
                    inputHandler={(value) => { changeValue('id', value) }}
                />
                <SelectInput optional
                    value={imageAsset.category}
                    label="category"
                    inputHandler={(value) => { changeValue('category', value) }}
                    options={imageAssetCategories}
                />
                <Stack direction={'row'}>
                    <OptionalNumberInput
                        value={imageAsset.rows}
                        label="rows"
                        inputHandler={(value) => { changeValue('rows', value) }}
                        min={1}
                    />
                    <OptionalNumberInput
                        value={imageAsset.cols}
                        label="cols"
                        inputHandler={(value) => { changeValue('cols', value) }}
                        min={1}
                    />
                </Stack>
                <Stack direction={'row'}>
                    <OptionalNumberInput
                        value={imageAsset.widthScale}
                        label="widthScale"
                        inputHandler={(value) => { changeValue('widthScale', value) }}
                        step={.1}
                    />
                    <OptionalNumberInput
                        value={imageAsset.heightScale}
                        label="heightScale"
                        inputHandler={(value) => { changeValue('heightScale', value) }}
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
            </Box>

            <Box display={'flex'} justifyContent={'space-between'} paddingTop={2}>
                <Button variant="contained"
                    disabled={isNewAsset}
                    startIcon={<AddIcon />}
                    onClick={saveAssetChanges}>
                    Save New Asset
                </Button>
                <Button variant="contained"
                    disabled={!isNewAsset}
                    startIcon={<SaveIcon />}
                    onClick={saveAssetChanges}>
                    Save Changes
                </Button>
            </Box>

            {saveWarning && <Alert severity="error">{saveWarning}</Alert>}
        </EditorBox>
    )
}