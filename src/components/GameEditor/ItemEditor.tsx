/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h, Component } from "preact"
import { ItemData } from "src"
import { SelectInput, StringInput } from "./formControls";
import { ServiceItemSelector } from "./ServiceItemSelector";
import imageService, { ImageAsset } from "../../services/imageService";
import styles from "./editorStyles.module.css"
import { ItemMenu } from "../ItemMenu";
import { cloneData } from "../../lib/clone";
import { StorageMenu } from "./StorageMenu";
import { DataItemEditorProps } from "./dataEditors";
import { FramePicker } from "./SpriteEditor/FramePicker";

type Props = DataItemEditorProps<ItemData> & {
    actorIds: string[];
    itemIds: string[];
}
type State = ItemData & {

}

const makeNewItem: { (): ItemData } = () => (
    {
        type: 'item',
        id: 'NEW_ITEM',
    }
)

export class ItemEditor extends Component<Props, State> {

    constructor(props: Props) {
        super(props)

        const initialData = props.data ? cloneData(props.data) : makeNewItem();

        this.state = {
            ...initialData
        }

        this.handleResetButton = this.handleResetButton.bind(this)
        this.handleUpdateButton = this.handleUpdateButton.bind(this)
        this.changeValue = this.changeValue.bind(this)
        this.setStateWithAutosave = this.setStateWithAutosave.bind(this)
        this.changeFrame = this.changeFrame.bind(this)
    }

    setStateWithAutosave(input: Partial<State> | { (state: State): Partial<State> }, callback?: { (): void }) {
        const { options, data, updateData, itemIds = [] } = this.props

        if (!options.autoSave) {
            return this.setState(input, callback)
        }

        return this.setState(input, () => {
            if (data && itemIds.includes(this.state.id)) {
                updateData(this.state)
            }
            if (callback) {
                callback()
            }
        })
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
        const modification: Partial<State> = {}
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

        return (
            <article>
                <h2>Item Editor</h2>
                <div class={styles.container}>
                    <fieldset class={styles.fieldset}>
                        <legend>Data</legend>
                        <StringInput
                            block className={styles.row}
                            label="id" value={id}
                            inputHandler={(value) => changeValue('id', value)} />
                        <StringInput
                            block className={styles.row}
                            label="name" value={name || ''}
                            inputHandler={(value) => changeValue('name', value)} />

                        <SelectInput
                            block className={styles.row}
                            label="actorId"
                            emptyOptionLabel="[no Actor]"
                            items={this.props.actorIds}
                            value={actorId}
                            haveEmptyOption={true}
                            onSelect={id => { changeValue('actorId', id) }} />

                        <ServiceItemSelector legend='picture'
                            format="select"
                            filterItems={item => (item as ImageAsset).category === 'item' || (item as ImageAsset).category === 'any'}
                            select={item => changeValue('imageId', item.id)}
                            selectNone={() => changeValue('imageId', undefined)}
                            service={imageService}
                            selectedItemId={this.state.imageId} />

                        {imageAsset?.rows && (
                            <div>row: {this.state.row}</div>
                        )}
                        {imageAsset?.cols && (
                            <div>col: {this.state.col}</div>
                        )}
                    </fieldset>
                    <fieldset class={styles.fieldset}>
                        <legend>Button Preview</legend>
                        <div className={styles.row}>
                            <span>Selected:</span>
                            <ItemMenu items={[this.state]} currentItemId={id} select={() => true} />
                        </div>
                        <div className={styles.row}>
                            <span>Not Selected:</span>
                            <ItemMenu items={[this.state]} currentItemId={''} select={() => true} />
                        </div>
                    </fieldset>
                </div>

                {(imageAsset?.rows || imageAsset?.cols) && (
                    <div class={styles.container}>
                        <FramePicker fixedSheet
                            sheetId={this.state.imageId}
                            row={this.state.row || 0}
                            col={this.state.col || 0}
                            pickFrame={this.changeFrame}
                        />
                    </div>
                )}

                <StorageMenu
                    data={this.state} type='ItemData'
                    originalId={this.props.data?.id}
                    existingIds={itemIds}
                    reset={this.handleResetButton}
                    deleteItem={this.props.deleteData}
                    update={this.handleUpdateButton}
                    options={this.props.options}
                />

            </article>
        )
    }
}