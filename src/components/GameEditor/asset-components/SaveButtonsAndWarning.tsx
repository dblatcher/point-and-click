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
            <Box display={'flex'} justifyContent={'flex-end'} paddingTop={2}>
                {isNewAsset ? (
                    <Button variant="contained"
                        startIcon={<AddIcon />}
                        onClick={saveAssetChanges}>
                        Save New Asset
                    </Button>
                ) : (
                    <Button variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={saveAssetChanges}>
                        Save Changes
                    </Button>
                )}
            </Box>
            {saveWarning && <Alert severity="error">{saveWarning}</Alert>}
        </ >
    )
}