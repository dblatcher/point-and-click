import { listIds } from "@/lib/util";
import { FileAsset } from "@/services/assets";
import { Box } from "@mui/material";
import { SelectInput } from "../../SchemaForm/SelectInput";
import { useSelectAsset } from "./useSelectAsset";

interface Props {
    assetType: 'image' | 'sound'
    legend: string;
    select: { (item: FileAsset): void };
    selectNone?: { (): void };
    selectedItemId?: string;
    filterItems?: { (item: FileAsset): boolean };
}

export const FileAssetSelector = ({
    assetType,
    select,
    selectNone,
    legend,
    selectedItemId = '',
    filterItems,
}: Props) => {
    const { itemsInFilter, handleSelect } = useSelectAsset({ assetType, select, selectNone, filterItems })
    return (
        <Box padding={1} minWidth={120}>
            <SelectInput label={legend}
                optional options={listIds(itemsInFilter)}
                value={selectedItemId}
                inputHandler={value => { handleSelect(value ?? '') }} />
        </Box>
    )
}