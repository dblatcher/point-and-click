/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h, Component } from "preact"
import { ItemData } from "../../definitions/ItemData"
import { eventToString } from "../../lib/util";
import { IdentInput, TextInput } from "./formControls";
import { ServiceItemSelector } from "./ServiceItemSelector";
import imageService, { ImageAsset } from "../../services/imageService";
import styles from "./editorStyles.module.css"
import { ItemMenu } from "../ItemMenu";
import { cloneData } from "../../lib/clone";

interface Props {
    data?: ItemData;
    updateData?: { (data: ItemData): void };
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

        this.handleResetButton=this.handleResetButton.bind(this)
        this.handleUpdateButton=this.handleUpdateButton.bind(this)
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
            case 'characterId':
            case 'imageId':
                if (typeof newValue === 'string' || typeof newValue === 'undefined') {
                    modification[propery] = newValue
                }
                break;
        }
        this.setState(modification)
    }

    render() {
        const { characterId = '', id } = this.state
        const updateButtonText = this.state.id === this.props.data?.id ? `update ${this.state.id}` : 'add new item'

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
                            <TextInput label="Characterid" value={characterId}
                                onInput={(event) => this.changeValue('characterId', eventToString(event))}
                            />
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
                            <ItemMenu items={[this.state]} currentItemId={id} select={() => { }} />
                        </div>
                        <div className={styles.row}>
                            <span>Not Selected:</span>
                            <ItemMenu items={[this.state]} currentItemId={''} select={() => { }} />
                        </div>
                    </fieldset>
                </div>
                <div>
                <fieldset className={styles.fieldset}>
                        <legend>storage</legend>
                        <div>
                            {/* <button onClick={this.handleSaveButton}>Save to file</button> */}
                            {/* <button onClick={this.handleLoadButton}>Load from file</button> */}
                        </div>
                        <div>
                            {this.props.data && <button onClick={this.handleResetButton}>Reset</button>}

                            {this.state.id && <button onClick={this.handleUpdateButton}>
                                {updateButtonText}
                            </button>}
                        </div>
                    </fieldset>
                </div>
            </article>
        )
    }
}