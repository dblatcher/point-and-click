import { AddIcon, ExclamationIcon, SaveIcon } from "@/components/GameEditor/material-icons";
import { FileAsset } from "@/services/assets";
import { Box, Button, ButtonProps, Tooltip } from "@mui/material";

enum Mode { EDIT = 'edit', CREATE = 'create' }

type Props<AssetType extends FileAsset> = {
    idIsAlreadyTaken: boolean;
    saveAssetChanges: { (asset: AssetType): void };
    mode: Mode;
    asset: Partial<AssetType>;
    buildAsset: () => {
        success: false;
        warning: string;
    } | {
        success: true;
        data: AssetType;
    }
}

const buttonDefaults: ButtonProps = {
    variant: "contained",
    fullWidth: true,
    size: 'medium',
    sx: {
        marginY: 2
    }
}

export const SaveButtons = <AssetType extends FileAsset>({
    asset,
    saveAssetChanges,
    idIsAlreadyTaken,
    mode,
    buildAsset
}: Props<AssetType>) => {

    const nonEmptyId = !!asset.id && asset.id.length > 0
    const assetResult = buildAsset();
    const buttonText = mode === 'edit' ? 'Save Changes' : 'Save New Asset'
    const idIsOk = mode === 'edit' ? true : nonEmptyId && !idIsAlreadyTaken;

    const validationWarning = !nonEmptyId
        ? 'no id'
        : idIsAlreadyTaken
            ? 'id already used'
            : !assetResult.success
                ? assetResult.warning
                : undefined

    return <Box display={'flex'}>
        <Button {...buttonDefaults}
            disabled={!assetResult.success || !idIsOk}
            startIcon={mode === 'edit' ? <SaveIcon /> : <AddIcon />}
            onClick={() => {
                if (!assetResult.success || !idIsOk) {
                    return
                }
                saveAssetChanges(assetResult.data)
            }}>
            {buttonText}
        </Button>
        <Box flexBasis={50} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            {validationWarning && (
                <Tooltip title={validationWarning}>
                    <ExclamationIcon color="warning" />
                </Tooltip>
            )}
        </Box>
    </Box>
}