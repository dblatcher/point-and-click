import { ItemData } from "@/definitions";
import { cloneData } from "@/lib/clone";
import imageService from "@/services/imageService";
import { ImageAsset } from "@/services/assets";
import { Stack, Dialog, Button, DialogContent, DialogActions, DialogTitle, Typography } from "@mui/material";
import { useState } from "react";
import { SelectInput } from "../SchemaForm/SelectInput";
import { ItemMenuInner } from "../game-ui/ItemMenu";
import { EditorBox } from "./EditorBox";
import { EditorHeading } from "./EditorHeading";
import { ServiceItemSelector } from "./ServiceItemSelector";
import { StorageMenu } from "./StorageMenu";
import { EnhancedSetStateFunction } from "./dataEditors";
import { StringInput } from "../SchemaForm/StringInput";
import { useGameDesign } from "@/context/game-design-context";
import { listIds } from "@/lib/util";
import { FramePicker } from "./SpriteEditor/FramePicker";

type Props = {
    data?: ItemData;
}

const makeNewItem: { (): ItemData } = () => (
    {
        type: 'item',
        id: 'NEW_ITEM',
    }
)

export const ItemEditor = (props: Props) => {

    const { gameDesign, options, deleteArrayItem, performUpdate } = useGameDesign()
    const [item, setItem] = useState<ItemData>((props.data ? cloneData(props.data) : makeNewItem()));
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const { actorId = '', id, name } = item
    const itemIds = listIds(gameDesign.items)

    const getCurrentData = () => {
        const { id, type, name, status, actorId, imageId, col, row } = item
        return { id, type, name, status, actorId, imageId, col, row }
    }

    const imageKey = `${item.imageId}-${item.row}-${item.col}`

    const setStateWithAutosave: EnhancedSetStateFunction<ItemData> = (input, callback) => {
        const { data } = props
        setItem({ ...item, ...input });
        if (options.autoSave) {
            const isExistingId = itemIds.includes(item.id);
            if (data && isExistingId) {
                performUpdate('items', getCurrentData())
            }
        }
        return callback ? callback() : undefined;
    }

    const changeValue = (propery: keyof ItemData, newValue: string | undefined) => {
        const modification: Partial<ItemData> = {}
        switch (propery) {
            case 'id':
                if (typeof newValue === 'string') {
                    modification[propery] = newValue.toUpperCase()
                }
                break;
            case 'name':
            case 'actorId':
            case 'imageId':
                if (typeof newValue === 'string' || typeof newValue === 'undefined') {
                    modification[propery] = newValue
                }
                break;
        }
        if (propery === 'id') {
            return setItem({ ...item, ...modification })
        }

        if (propery === 'imageId') {
            modification.row = undefined
            modification.col = undefined
        }
        setStateWithAutosave(modification)
    }

    return (
        <Stack component='article' spacing={1}>
            <EditorHeading heading="Item Editor" helpTopic="items" itemId={id} />
            <Stack direction={'row'} spacing={1}>
                <EditorBox title="Data">
                    <Stack spacing={2}>
                        <StringInput
                            label="id" value={id}
                            inputHandler={(value) => changeValue('id', value)} />
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
                </EditorBox>

                <EditorBox title="Button Preview">
                    <Stack sx={{ maxWidth: '10rem' }}>
                        <Typography variant="caption">Selected:</Typography>
                        <ItemMenuInner key={`${imageKey}-selected`} items={[item]} currentItemId={id} select={() => true} />
                        <Typography variant="caption">Not Selected:</Typography>
                        <ItemMenuInner key={`${imageKey}-not-selected`} items={[item]} currentItemId={''} select={() => true} />
                    </Stack>
                </EditorBox>

                <StorageMenu
                    data={item} type='ItemData'
                    originalId={props.data?.id}
                    existingIds={itemIds}
                    reset={() => {
                        const initialState = props.data ? cloneData(props.data) : makeNewItem()
                        setItem({
                            ...initialState
                        })
                    }}
                    deleteItem={(index) => { deleteArrayItem(index, 'items') }}
                    update={() => { performUpdate('items', item) }}
                    options={options}
                />
            </Stack>

            <Dialog
                open={dialogOpen}
                onClose={() => { setDialogOpen(false) }}
            >
                <DialogTitle>
                    Pick Icon for {item.id}
                </DialogTitle>
                <DialogContent>
                    <ServiceItemSelector legend='image asset'
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
                            setStateWithAutosave({ col, row })
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
