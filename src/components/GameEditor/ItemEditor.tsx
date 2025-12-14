import { useGameDesign } from "@/context/game-design-context";
import { ItemData } from "@/definitions";
import { patchMember } from "@/lib/update-design";
import { listIds } from "@/lib/util";
import { Box, Stack, Typography } from "@mui/material";
import { SelectInput } from "../SchemaForm/SelectInput";
import { DelayedStringInput } from "./DelayedStringInput";
import { EditorHeading } from "./layout/EditorHeading";
import { FramePickDialogButton } from "./FramePickDialogButton";
import { InteractionsDialogsButton } from "./InteractionsDialogsButton";
import { ItemEditorHeaderControls } from "./game-item-components/ItemEditorHeaderControls";
import { FramePreview } from "./FramePreview";
import { HideImageOutlinedIcon } from "./material-icons";

type Props = {
    item: ItemData;
}

export const ItemEditor = ({ item }: Props) => {
    const { gameDesign, applyModification } = useGameDesign()
    const { actorId = '', id, name, imageId, row = 0, col = 0 } = item

    const updateFromPartial = (input: Partial<ItemData>, messageDetail = '') => {
        if (input.id && input.id !== item.id) {
            console.warn(`tried to change id in ItemEditor`, { input })
            return
        }
        applyModification(`edit item ${id} ${messageDetail}`, { items: patchMember(id, input, gameDesign.items) })
    }


    return (
        <Stack component='article' spacing={3}>
            <EditorHeading heading="Item Editor" helpTopic="items" itemId={id} >
                <ItemEditorHeaderControls
                    dataItem={item}
                    itemType="items"
                    itemTypeName="Inventory Item"
                />
            </EditorHeading>

            <Stack spacing={2} maxWidth={'sm'}>
                <DelayedStringInput
                    label="name" value={name || ''}
                    inputHandler={(name) => updateFromPartial({ name }, `rename to "${name}"`)} />
                <SelectInput
                    label="actor starting with item"
                    optional
                    options={listIds(gameDesign.actors)}
                    value={actorId}
                    inputHandler={actorId => updateFromPartial({ actorId }, 'starting actor')} />

                <FramePickDialogButton
                    buttonLabel="pick icon"
                    showRemoveButton
                    title={`Pick image for ${item.id}`}
                    filterAssets={(item) => item.category === 'spriteSheet' || item.category === 'any' || item.category === 'item'}
                    pickFrame={(row, col, imageId) => {
                        if (imageId) {
                            updateFromPartial({ col, row, imageId }, `use frame [${col}, ${row}] of ${imageId}`)
                        } else {
                            updateFromPartial({ col, row, imageId }, `remove icon`)
                        }
                    }}
                    buttonProps={{
                        sx: { width: 120 }
                    }}
                    buttonContent={
                        <Box >
                            <Typography>Pick Icon</Typography>
                            {imageId
                                ? <FramePreview frame={{ imageId, row, col }} height={100} width={100} />
                                : <Box><HideImageOutlinedIcon sx={{ height: 50, width: 50 }} /></Box>}
                        </Box>
                    }
                    defaultState={{
                        imageId: item.imageId,
                        row: item.row,
                        col: item.col,
                    }}
                />

                <Box display='flex' gap={2}>
                    <InteractionsDialogsButton
                        label="interactions as target"
                        criteria={(interaction) => interaction.targetId === id}
                        newPartial={{ targetId: id }}
                    />

                    <InteractionsDialogsButton
                        label="interactions as item"
                        criteria={(interaction) => interaction.itemId === id}
                        newPartial={{ itemId: id }}
                    />
                </Box>
            </Stack>
        </Stack >
    )
}
