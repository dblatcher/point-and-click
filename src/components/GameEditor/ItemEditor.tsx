/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h, Component } from "preact"
import { ItemData } from "src"
import { eventToString } from "../../lib/util";
import { IdentInput, SelectInput } from "./formControls";
import { ServiceItemSelector } from "./ServiceItemSelector";
import imageService, { ImageAsset } from "../../services/imageService";
import styles from "./editorStyles.module.css"
import { ItemMenu } from "../ItemMenu";
import { cloneData } from "../../lib/clone";
import { StorageMenu } from "./StorageMenu";

interface Props {
    data?: ItemData;
    actorIds: string[];
    updateData?: { (data: ItemData): void };
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

        const initialData = props.data ? { ...props.data } : makeNewItem();

        this.state = {
            ...initialData
        }

        this.handleResetButton = this.handleResetButton.bind(this)
        this.handleUpdateButton = this.handleUpdateButton.bind(this)
    }

    handleResetButton() {
        const { props } = this
        const initialState = props.data ? cloneData(props.data) : makeNewItem()
        this.setState({
            ...initialState
        })
    }
    handleUpdateButton() {
        if (this.props.updateData) {
            this.props.updateData(this.state)
        }
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
        this.setState(modification)
    }

    render() {
        const { actorId = '', id } = this.state
        const { itemIds } = this.props

        return (
            <article>
                <h2>Item Editor</h2>
                <div class={styles.container}>
                    <fieldset class={styles.fieldset}>
                        <legend>Data</legend>
                        <IdentInput showType={true} value={this.state}
                            onChangeId={(event) => this.changeValue('id', eventToString(event))}
                            onChangeName={(event) => this.changeValue('name', eventToString(event))}
                        />

                        <div>
                            <SelectInput label="actorId"
                                emptyOptionLabel="[no Actor]"
                                items={this.props.actorIds}
                                value={actorId}
                                haveEmptyOption={true}
                                onSelect={id => { this.changeValue('actorId', id) }} />
                        </div>

                        <ServiceItemSelector legend='picture'
                            format="select"
                            filterItems={item => (item as ImageAsset).category === 'item'}
                            select={item => this.changeValue('imageId', item.id)}
                            selectNone={() => this.changeValue('imageId', undefined)}
                            service={imageService}
                            selectedItemId={this.state.imageId} />
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
                <div>
                    <StorageMenu
                        data={this.state} type='ItemData'
                        originalId={this.props.data?.id}
                        existingIds={itemIds}
                        reset={this.handleResetButton}
                        update={this.handleUpdateButton} />
                </div>
            </article>
        )
    }
}