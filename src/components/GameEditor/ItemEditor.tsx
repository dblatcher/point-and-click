import { ItemData } from "@/definitions";
import { cloneData } from "@/lib/clone";
import imageService, { ImageAsset } from "@/services/imageService";
import { Stack, Dialog, Button, DialogContent, DialogActions, DialogTitle, Typography } from "@mui/material";
import { Component } from "react";
import { SelectInput } from "../SchemaForm/SelectInput";
import { ItemMenu } from "../game-ui/ItemMenu";
import { EditorBox } from "./EditorBox";
import { EditorHeading } from "./EditorHeading";
import { ServiceItemSelector } from "./ServiceItemSelector";
import { FramePicker } from "./SpriteEditor/FramePicker";
import { StorageMenu } from "./StorageMenu";
import { DataItemEditorProps, EnhancedSetStateFunction, higherLevelSetStateWithAutosave } from "./dataEditors";
import { StringInput } from "../SchemaForm/StringInput";

type Props = DataItemEditorProps<ItemData> & {
    actorIds: string[];
    itemIds: string[];
}
type State = ItemData & {
    dialogOpen: boolean
}

const makeNewItem: { (): ItemData } = () => (
    {
        type: 'item',
        id: 'NEW_ITEM',
    }
)

export class ItemEditor extends Component<Props, State> {

    setStateWithAutosave: EnhancedSetStateFunction<State>
    constructor(props: Props) {
        super(props)

        const initialData = props.data ? cloneData(props.data) : makeNewItem();

        this.state = {
            ...initialData,
            dialogOpen: false,
        }

        this.handleResetButton = this.handleResetButton.bind(this)
        this.handleUpdateButton = this.handleUpdateButton.bind(this)
        this.changeValue = this.changeValue.bind(this)
        this.setStateWithAutosave = higherLevelSetStateWithAutosave(this).bind(this)
        this.changeFrame = this.changeFrame.bind(this)
    }

    get currentData(): ItemData {
        const { id, type, name, status, actorId, imageId, col, row } = this.state
        return { id, type, name, status, actorId, imageId, col, row }
    }
    get existingIds() {
        return this.props.itemIds
    }

    handleResetButton() {
        const { props } = this
        const initialState = props.data ? cloneData(props.data) : makeNewItem()
        this.setState({
            ...initialState
        })
    }
    handleUpdateButton() {
        this.props.updateData(this.state)
    }

    changeValue(propery: keyof ItemData, newValue: string | undefined) {
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
            return this.setState(modification)
        }

        if (propery === 'imageId') {
            modification.row = undefined
            modification.col = undefined
        }
        this.setStateWithAutosave(modification)
    }

    changeFrame(row: number, col: number) {
        this.setStateWithAutosave({ col, row })
    }

    render() {
        const { changeValue } = this
        const { actorId = '', id, name, imageId } = this.state
        const { itemIds } = this.props

        const imageAsset = imageId ? imageService.get(imageId) : undefined
        const imageKey = `${this.state.imageId}-${this.state.row}-${this.state.col}`

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
                                options={this.props.actorIds}
                                value={actorId}
                                inputHandler={id => { changeValue('actorId', id) }} />

                            <Button
                                onClick={() => { this.setState({ dialogOpen: true }) }}
                                variant="outlined"
                            >
                                pick icon
                            </Button>
                        </Stack>
                    </EditorBox>

                    <EditorBox title="Button Preview">
                        <Stack sx={{maxWidth:'10rem'}}>
                            <Typography variant="caption">Selected:</Typography>
                            <ItemMenu key={`${imageKey}-selected`} items={[this.state]} currentItemId={id} select={() => true} />
                            <Typography variant="caption">Not Selected:</Typography>
                            <ItemMenu key={`${imageKey}-not-selected`} items={[this.state]} currentItemId={''} select={() => true} />
                        </Stack>
                    </EditorBox>

                    <StorageMenu
                        data={this.state} type='ItemData'
                        originalId={this.props.data?.id}
                        existingIds={itemIds}
                        reset={this.handleResetButton}
                        deleteItem={this.props.deleteData}
                        update={this.handleUpdateButton}
                        options={this.props.options}
                    />
                </Stack>

                <Dialog
                    open={this.state.dialogOpen}
                    onClose={() => { this.setState({ dialogOpen: false }) }}
                >
                    <DialogTitle>
                        Pick Icon for {this.state.id}
                    </DialogTitle>
                    <DialogContent>
                        <ServiceItemSelector legend='image asset'
                            format="select"
                            filterItems={item => (item as ImageAsset).category === 'item' || (item as ImageAsset).category === 'any'}
                            select={item => changeValue('imageId', item.id)}
                            selectNone={() => changeValue('imageId', undefined)}
                            service={imageService}
                            selectedItemId={this.state.imageId} />
                        <FramePicker fixedSheet
                            sheetId={this.state.imageId}
                            row={this.state.row || 0}
                            col={this.state.col || 0}
                            pickFrame={this.changeFrame}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { this.setState({ dialogOpen: false }) }}>done</Button>
                    </DialogActions>
                </Dialog>
            </Stack>
        )
    }
}