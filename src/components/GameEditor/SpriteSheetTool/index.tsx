/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, createRef, h, RefObject } from "preact";
import { SpriteSheet } from "../../../definitions/SpriteSheet";
import spriteSheetService from "../../../services/spriteSheetService";
import { eventToString } from "../../../lib/util";
import { NumberInput, TextInput, Warning } from "../formControls";
import { cloneData } from "../../../lib/clone";
import { ServiceItemSelector } from "../ServiceItemSelector";
import styles from '../editorStyles.module.css';
import { SpriteSheetPreview } from "../SpriteSheetPreview";
import imageService, { ImageAsset } from "../../../services/imageService";
import { StorageMenu } from "../StorageMenu";

type ExtraState = {
    urlIsObjectUrl: boolean;
    saveWarning?: string;
}

type State = SpriteSheet & ExtraState

type Props = {
    data?: SpriteSheet;
    updateData?: { (data: SpriteSheet): void };
    spriteSheetIds: string[];
}

const getNewBlankSheet: { (): SpriteSheet } = () => ({
    cols: 1,
    rows: 1,
    id: "NEW_SHEET",
    imageId: '',
})

const canvasScale = 1000

export class SpriteSheetTool extends Component<Props, State> {
    canvasRef: RefObject<HTMLCanvasElement>

    constructor(props: Props) {
        super(props)

        const initialData: SpriteSheet = props.data ? cloneData(props.data) : getNewBlankSheet()

        this.state = {
            urlIsObjectUrl: false,
            ...initialData,
        }
        this.handleUpdateButton = this.handleUpdateButton.bind(this)
        this.handleResetButton = this.handleResetButton.bind(this)
        this.canvasRef = createRef()
    }

    get currentData(): SpriteSheet {
        const copy = cloneData(this.state) as SpriteSheet & Partial<ExtraState>;
        delete copy.urlIsObjectUrl
        delete copy.saveWarning
        return copy
    }

    changeValue(propery: keyof SpriteSheet, newValue: string | number) {
        const modification: Partial<State> = {
            saveWarning: undefined,
        }
        switch (propery) {
            case 'cols':
            case 'rows':
            case 'heightScale':
            case 'widthScale':
                if (typeof newValue === 'number') {
                    modification[propery] = newValue
                }
                break;
            case 'imageId':
                if (typeof newValue === 'string') {
                    modification[propery] = newValue
                }
                break;
            case 'id':
                if (typeof newValue === 'string') {
                    modification[propery] = newValue.toUpperCase()
                }
                break;
        }
        this.setState(modification)
    }

    handleUpdateButton() {
        const { currentData } = this
        const { updateData } = this.props
        if (!currentData.id) {
            this.setState({ saveWarning: 'NO ID' })
            return
        }
        if (!currentData.imageId) {
            this.setState({ saveWarning: 'NO ImageId' })
            return
        }

        this.setState({ saveWarning: undefined }, () => {
            spriteSheetService.add(currentData)
            if (updateData) {
                updateData(currentData)
            }
        })
    }

    handleResetButton() {
        const { data } = this.props
        const initialData: SpriteSheet = data ? cloneData(data) : getNewBlankSheet()
        this.setState({
            urlIsObjectUrl: false,
            ...initialData,
        })
    }

    render() {
        const {
            imageId = "", rows = 1, cols = 1, widthScale = 1, heightScale = 1, id = "", saveWarning
        } = this.state

        const {
            spriteSheetIds
        } = this.props

        return (
            <article>
                <h2>SpriteSheetTool</h2>

                <div className={styles.container}>
                    <section>
                        <fieldset className={styles.fieldset}>
                            <legend>sheet properties</legend>


                            <div className={styles.row}>
                                <TextInput label="ID" value={id} onInput={event => this.changeValue('id', eventToString(event))} />
                            </div>
                            <div className={styles.row}>
                                <ServiceItemSelector
                                    format='select'
                                    selectedItemId={imageId}
                                    service={imageService} legend="pick image"
                                    select={(item) => { this.changeValue('imageId', item.id) }}
                                    filterItems={(item) => (item as ImageAsset).category === 'spriteSheet'}
                                />
                            </div>
                            <div className={styles.row}>
                                <NumberInput label="rows" value={rows} min={1}
                                    inputHandler={
                                        value => { this.changeValue('rows', value) }
                                    }
                                />
                                <NumberInput label="cols" value={cols} min={1}
                                    inputHandler={
                                        value => { this.changeValue('cols', value) }
                                    }
                                />
                            </div>
                            <div className={styles.row}>
                                <NumberInput label="widthScale" value={widthScale} step={.1}
                                    inputHandler={
                                        value => { this.changeValue('widthScale', value) }
                                    }
                                />
                                <NumberInput label="heightScale" value={heightScale} step={.1}
                                    inputHandler={
                                        value => { this.changeValue('heightScale', value) }
                                    }
                                />
                            </div>
                        </fieldset>

                        <fieldset className={styles.fieldset}>
                            <div className={styles.row}>
                                {saveWarning && (
                                    <Warning>{saveWarning}</Warning>
                                )}
                            </div>
                        </fieldset>

                        <StorageMenu
                            data={this.props.data}
                            originalId={this.props.data?.id}
                            existingIds={spriteSheetIds}
                            type='spriteSheet'
                            update={this.handleUpdateButton}
                            reset={this.handleResetButton}
                        />
                    </section>
                    <section>
                        <p>Resizing the preview does not effect the SpriteSheet data.</p>
                        <p>The dimensions of the frame are set on the sprite objects.</p>

                        <SpriteSheetPreview
                            sheet={{ rows, cols, imageId, id }}
                            canvasScale={canvasScale} />
                    </section>
                </div>
            </article>
        )
    }
}
