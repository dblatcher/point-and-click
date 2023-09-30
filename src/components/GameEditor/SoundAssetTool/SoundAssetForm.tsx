import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { StringInput } from "@/components/SchemaForm/StringInput";
import {
    SoundAsset, soundAssetCategories
} from "@/services/assets";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from "@mui/icons-material/Upload";
import { Alert, Box, Button, Stack } from "@mui/material";
import { EditorBox } from "../EditorBox";

interface Props {
    soundAsset: Partial<SoundAsset>;
    changeValue: { (propery: keyof SoundAsset, newValue: string | number | undefined): void }
    loadFile: { (): Promise<void> }
    isNewAsset: boolean
    saveAssetChanges: { (): void }
    saveWarning?: string
}


export const SoundAssetForm = ({ soundAsset, changeValue, loadFile, isNewAsset, saveAssetChanges, saveWarning }: Props) => {
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
                <Button variant="outlined"
                    startIcon={<UploadIcon />}
                    onClick={loadFile}>
                    upload sound file
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