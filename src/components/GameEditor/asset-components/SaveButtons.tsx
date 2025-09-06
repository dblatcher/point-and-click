import { AddIcon, SaveIcon } from "@/components/GameEditor/material-icons";
import { Button, ButtonProps } from "@mui/material";

enum Mode { EDIT = 'edit', CREATE = 'create' }

interface Props {
    idIsValid: boolean;
    idIsAlreadyTaken: boolean;
    saveAssetChanges: { (): void };
    mode: Mode;
}

const buttonDefaults: ButtonProps = {
    variant: "contained",
    fullWidth: true,
    size: 'medium',
    sx: {
        marginY: 2
    }
}

export const SaveButtons = ({ saveAssetChanges, idIsAlreadyTaken, idIsValid, mode }: Props) => {

    if (mode === 'edit') {
        return <Button {...buttonDefaults}
            startIcon={<SaveIcon />}
            onClick={saveAssetChanges}>
            Save Changes
        </Button>
    }

    return <Button {...buttonDefaults}
        startIcon={<AddIcon />}
        disabled={!idIsValid || idIsAlreadyTaken}
        onClick={() => {
            if (!idIsValid || idIsAlreadyTaken) {
                return
            }
            saveAssetChanges()
        }}>
        Save New Asset
    </Button>
}