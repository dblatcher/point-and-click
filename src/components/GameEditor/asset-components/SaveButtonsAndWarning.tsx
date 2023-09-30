import AddIcon from "@mui/icons-material/Add";
import SaveIcon from '@mui/icons-material/Save';
import { Alert, Box, Button } from "@mui/material";

interface Props {
    isNewAsset: boolean
    saveAssetChanges: { (): void }
    saveWarning?: string
}


export const SaveButtonsAndWarning = ({ saveAssetChanges, isNewAsset, saveWarning }: Props) => {
    return (
        <>
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
        </ >
    )
}