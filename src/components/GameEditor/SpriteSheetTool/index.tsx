/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, createRef, h, RefObject } from "preact";
import { SpriteSheet } from "../../../definitions/SpriteSheet";
import spriteSheetService from "../../../services/spriteSheetService";
import { eventToString } from "../../../lib/util";
import { NumberInput, TextInput, Warning } from "../formControls";
import { cloneData } from "../../../lib/clone";
import { ServiceItemSelector } from "../ServiceItemSelector";
import { ServiceItem } from "src/services/Service";
import styles from '../editorStyles.module.css';
import { SpriteSheetPreview } from "../SpriteSheetPreview";
import imageService, { ImageAsset } from "../../../services/imageService";

type ExtraState = {
    urlIsObjectUrl: boolean;
    saveWarning?: string;
}

type State = Partial<SpriteSheet> & ExtraState

const canvasScale = 1000

export class SpriteSheetTool extends Component<{}, State> {
    canvasRef: RefObject<HTMLCanvasElement>

    constructor(props: SpriteSheetTool['props']) {
        super(props)
        this.state = {
            urlIsObjectUrl: false,
            cols: 1,
            rows: 1,
            id: "NEW_SHEET"
        }
        this.saveToService = this.saveToService.bind(this)
        this.openFromService = this.openFromService.bind(this)

        this.canvasRef = createRef()
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

    saveToService() {
        const { state } = this

        if (!state.id) {
            this.setState({ saveWarning: 'NO ID' })
            return
        }
        if (!state.imageId) {
            this.setState({ saveWarning: 'NO ImageId' })
            return
        }

        const copy = cloneData(state) as SpriteSheet & Partial<ExtraState>
        delete copy.urlIsObjectUrl
        delete copy.saveWarning

        this.setState({ saveWarning: undefined }, () => {
            spriteSheetService.add(copy)
        })
    }

    openFromService(sheet: ServiceItem) {
        const copy = cloneData(sheet as SpriteSheet);
        this.setState(state => {
            const newState = {
                ...state,
                ...copy,
            }
            return newState
        })

    }

    render() {
        const {
            imageId = "", rows = 1, cols = 1, widthScale = 1, heightScale = 1, id = "", saveWarning
        } = this.state

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
                                <button onClick={this.saveToService}>Save to service</button>
                                {saveWarning && (
                                    <Warning>{saveWarning}</Warning>
                                )}
                            </div>
                        </fieldset>
                        <ServiceItemSelector legend="open sheet"
                            service={spriteSheetService} select={this.openFromService} />
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
