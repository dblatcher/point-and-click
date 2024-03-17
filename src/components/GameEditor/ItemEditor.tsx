import { useGameDesign } from "@/context/game-design-context";
import { ItemData } from "@/definitions";
import { cloneData } from "@/lib/clone";
import { listIds } from "@/lib/util";
import { ImageAsset } from "@/services/assets";
import imageService from "@/services/imageService";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { SelectInput } from "../SchemaForm/SelectInput";
import { StringInput } from "../SchemaForm/StringInput";
import { ItemMenuInner } from "../game-ui/ItemMenu";
import { ButtonWithConfirm } from "./ButtonWithConfirm";
import { EditorBox } from "./EditorBox";
import { EditorHeading } from "./EditorHeading";
import { FileAssetSelector } from "./FileAssetSelector";
import { FramePicker } from "./SpriteEditor/FramePicker";

type Props = {
    data: ItemData;
}

export const ItemEditor = (props: Props) => {

    const { gameDesign, deleteArrayItem, performUpdate } = useGameDesign()
    const { data: item } = props
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const { actorId = '', id, name } = item

    const imageKey = `${item.imageId}-${item.row}-${item.col}`

    const updateFromPartial = (input: Partial<ItemData>) => {
        if (input.id && input.id !== item.id) {
            console.warn(`tried to change id in ItemEditor`, { input })
            return
        }
        performUpdate('items', { ...cloneData(item), ...input })
    }

    const changeValue = (propery: keyof ItemData, newValue: string | undefined) => {
        const modification: Partial<ItemData> = {}
        switch (propery) {
            case 'id':
                console.warn(`tried to change id in ItemEditor`, { newValue })
                return
            case 'name':
            case 'actorId':
            case 'imageId':
                if (typeof newValue === 'string' || typeof newValue === 'undefined') {
                    modification[propery] = newValue
                }
                break;
        }
        if (propery === 'imageId') {
            modification.row = undefined
            modification.col = undefined
        }
        updateFromPartial(modification)
    }

    return (
        <Stack component='article' spacing={3}>
            <EditorHeading heading="Item Editor" helpTopic="items" itemId={id} />
            <Stack direction={'row'} spacing={1}>
                <Stack spacing={2}>
                    <StringInput
                        label="name" value={name || ''}
                        inputHandler={(value) => changeValue('name', value)} />
                    <SelectInput
                        label="actorId"
                        optional
                        options={listIds(gameDesign.actors)}
                        value={actorId}
                        inputHandler={id => { changeValue('actorId', id) }} />
                    <Button
                        onClick={() => { setDialogOpen(true) }}
                        variant="outlined"
                    >
                        pick icon
                    </Button>
                </Stack>
                <Box>
                    <ButtonWithConfirm
                        confirmationText={`Are you sure you want to delete item "${item.id}"?`}
                        label="delete"
                        buttonProps={{ startIcon: <DeleteIcon /> }}
                        onClick={() => {
                            const index = gameDesign.items.findIndex(otherItem => otherItem.id === item.id)
                            if (index === -1) {
                                return console.error('item not found when trying to delete', { item, items: gameDesign.items })
                            }
                            deleteArrayItem(index, 'items')
                        }}
                    />
                </Box>
            </Stack>

            <EditorBox title="Button Preview">
                <Stack direction={'row'} sx={{ maxWidth: '22rem' }}>
                    <Box sx={{ maxWidth: '10rem' }}>
                        <Typography variant="caption">Selected:</Typography>
                        <ItemMenuInner key={`${imageKey}-selected`} items={[item]} currentItemId={id} select={() => true} />
                    </Box>
                    <Box sx={{ maxWidth: '10rem' }}>
                        <Typography variant="caption">Not Selected:</Typography>
                        <ItemMenuInner key={`${imageKey}-not-selected`} items={[item]} currentItemId={''} select={() => true} />
                    </Box>
                </Stack>
            </EditorBox>

            <Dialog
                open={dialogOpen}
                onClose={() => { setDialogOpen(false) }}
            >
                <DialogTitle>
                    Pick Icon for {item.id}
                </DialogTitle>
                <DialogContent>
                    <FileAssetSelector legend='image asset'
                        format="select"
                        filterItems={item => (item as ImageAsset).category === 'item' || (item as ImageAsset).category === 'any'}
                        select={item => changeValue('imageId', item.id)}
                        selectNone={() => changeValue('imageId', undefined)}
                        service={imageService}
                        selectedItemId={item.imageId} />
                    <FramePicker fixedSheet noOptions
                        sheetId={item.imageId}
                        row={item.row || 0}
                        col={item.col || 0}
                        pickFrame={(row: number, col: number) => {
                            updateFromPartial({ col, row })
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setDialogOpen(false) }}>done</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    )
}
