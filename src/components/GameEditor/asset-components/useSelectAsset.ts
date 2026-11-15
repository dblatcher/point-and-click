import { useAssets } from "@/context/asset-context";
import { findById } from "@/lib/util";
import { FileAsset } from "point-click-components";


type UseSelectAssetProps = {
    assetType: 'image' | 'sound'
    select: { (item: FileAsset): void };
    selectNone?: { (): void };
    filterItems?: { (item: FileAsset): boolean };
}


export const useSelectAsset = ({ assetType, select, selectNone, filterItems }: UseSelectAssetProps) => {
    const assets = useAssets()
    const all: FileAsset[] = assetType === 'image' ? assets.imageAssets : assets.soundAssets
    const deleteItem = assetType === 'image' ? assets.removeImageAsset : assets.removeSoundAsset

    const handleSelect = (id: string) => {
        if (id === '' && selectNone) {
            return selectNone();
        }
        const item = findById(id, all)
        if (item) {
            select(item)
        }
    }

    const itemsInFilter = filterItems
        ? all.filter(filterItems)
        : [...all];

    return {
        deleteItem, handleSelect, itemsInFilter
    }
}