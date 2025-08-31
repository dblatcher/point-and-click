import { AddIcon, SaveIcon } from "@/components/GameEditor/material-icons";
import { Button } from "@mui/material";

interface Props {
    isNewAsset: boolean
    saveAssetChanges: { (): void }
}


export const SaveButtons = ({ saveAssetChanges, isNewAsset }: Props) => {
    return (
        <>
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
        </>
    )
}