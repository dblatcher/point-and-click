import { AddIcon, SaveIcon } from "@/components/GameEditor/material-icons";
import { Button } from "@mui/material";

enum Mode { EDIT = 'edit', CREATE = 'create' }

interface Props {
    idIsValid: boolean;
    idIsAlreadyTaken: boolean;
    saveAssetChanges: { (): void };
    mode: Mode;
}

export const SaveButtons = ({ saveAssetChanges, idIsAlreadyTaken, idIsValid, mode }: Props) => {

    if (mode === 'edit') {
        return <Button variant="contained"
            fullWidth
            startIcon={<SaveIcon />}
            onClick={saveAssetChanges}>
            Save Changes
        </Button>
    }

    return <Button variant="contained"
        fullWidth
        disabled={!idIsValid || idIsAlreadyTaken}
        startIcon={<AddIcon />}
        onClick={() => {
            if (!idIsValid || idIsAlreadyTaken) {
                return
            }
            saveAssetChanges()
        }}>
        Save New Asset
    </Button>
}