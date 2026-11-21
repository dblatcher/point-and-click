import { AddIcon, ExclamationIcon, SaveIcon } from "@/components/GameEditor/material-icons";
import { useAssets } from "@/context/asset-context";
import { AssetType, FileAsset } from "@/services/assets";
import { Box, Button, ButtonProps, Tooltip } from "@mui/material";

enum Mode { EDIT = 'edit', CREATE = 'create' }

type Props<TypedAsset extends FileAsset> = {
    assetType: AssetType;
    saveAssetChanges: { (asset: TypedAsset): void };
    mode: Mode;
    asset: Partial<TypedAsset>;
    buildAsset: () => {
        success: false;
        warning: string;
    } | {
        success: true;
        data: TypedAsset;
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

export const SaveButtons = <TypedAsset extends FileAsset>({
    asset,
    saveAssetChanges,
    mode,
    buildAsset,
    assetType,
}: Props<TypedAsset>) => {

    const { soundAssets, imageAssets } = useAssets()
    const allAssets = assetType === 'image' ? imageAssets : soundAssets;
    const currentAssetIds = allAssets.map(asset => asset.id)
    
    const idIsAlreadyTaken = !!asset.id && currentAssetIds.includes(asset.id)
    const nonEmptyId = !!asset.id && asset.id.length > 0
    const idIsOk = mode === 'edit' ? true : nonEmptyId && idIsAlreadyTaken;
    
    const assetResult = buildAsset();
    const validationWarning = !nonEmptyId
        ? 'no id'
        : (idIsAlreadyTaken && mode === Mode.CREATE)
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
            {mode === 'edit' ? 'Save Changes' : 'Save New Asset'}
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