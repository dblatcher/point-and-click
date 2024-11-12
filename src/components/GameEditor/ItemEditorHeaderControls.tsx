import { GameDataItem } from "@/definitions";
import { GameDataItemType } from "@/definitions/Game";
import { Box, ButtonGroup } from "@mui/material";
import { DeleteDataItemButton } from "./DeleteDataItemButton";
import { DownloadJsonButton } from "./SpriteEditor/DownloadJsonButton";
import { useGameDesign } from "@/context/game-design-context";
import { SelectInput } from "../SchemaForm/SelectInput";
import { listIds } from "@/lib/util";
import { DATA_TYPES_WITH_JSON } from "@/lib/editor-config";

interface Props<DataType extends GameDataItem> {
    dataItem: DataType;
    itemType: GameDataItemType;
    itemTypeName: string;
}

export const ItemEditorHeaderControls = <DataType extends GameDataItem>({ dataItem, itemType, itemTypeName }: Props<DataType>) => {
    const { gameDesign, openInEditor } = useGameDesign()
    const list = (gameDesign[itemType] ?? []) as DataType[]

    return <Box display={'flex'} gap={5}>
        <ButtonGroup>
            <DeleteDataItemButton
                dataItem={dataItem}
                itemType={itemType}
                itemTypeName={itemTypeName}
            />
            {DATA_TYPES_WITH_JSON.includes(itemType) &&
                <DownloadJsonButton
                    dataItem={dataItem}
                    itemTypeName={itemTypeName}
                />
            }
        </ButtonGroup>
        <Box minWidth={150}>
            <SelectInput
                label={`pick ${itemTypeName}`}
                options={listIds(list)}
                value={dataItem.id}
                inputHandler={(newItemId) => { openInEditor(itemType, newItemId) }}
            />
        </Box>
    </Box>
}