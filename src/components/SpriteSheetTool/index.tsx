/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, createRef, h, RefObject } from "preact";
import { SpriteSheet } from "../../definitions/SpriteSheet";
import spriteSheetService from "../../services/spriteSheetService";
import { fileToImageUrl, uploadFile } from "../../lib/files"
import { eventToNumber, eventToString } from "../../lib/util";
import { NumberInput, TextInput, Warning } from "../formControls";
import { cloneData } from "../../lib/clone";

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
        this.loadFile = this.loadFile.bind(this)
        this.saveToService = this.saveToService.bind(this)
        this.openFromService = this.openFromService.bind(this)

        this.canvasRef = createRef()
    }

    componentDidMount() {
        this.updateCanvas()
    }

    loadFile = async () => {
        const { urlIsObjectUrl, url: oldUrl } = this.state
        const file = await uploadFile()
        if (!file) { return }
        const newUrl = fileToImageUrl(file)

        if (oldUrl && urlIsObjectUrl && typeof window !== undefined) {
            window.URL.revokeObjectURL(oldUrl)
        }

        this.setState({ url: newUrl, urlIsObjectUrl: true, saveWarning: undefined })
    }

    updateCanvas() {
        const canvas = this.canvasRef.current
        if (!canvas) { return }
        const ctx = canvas.getContext('2d')
        if (!ctx) { return }
        const { rows = 1, cols = 1 } = this.state

        ctx.clearRect(0, 0, canvasScale, canvasScale)
        ctx.lineWidth = 3;
        for (let i = 1; i < rows; i++) {
            ctx.beginPath()
            ctx.moveTo(0, canvasScale * (i / rows))
            ctx.lineTo(canvasScale, canvasScale * (i / rows))
            ctx.stroke()
        }
        for (let i = 1; i < cols; i++) {
            ctx.beginPath()
            ctx.moveTo(canvasScale * (i / cols), 0)
            ctx.lineTo(canvasScale * (i / cols), canvasScale)
            ctx.stroke()
        }
    }

    get frameStyle(): h.JSX.CSSProperties {
        return {
            width: '300px',
            border: '2px solid red',
            resize: 'horizontal',
            overflow: 'auto',
            position: 'relative'
        }
    }

    get imageStyle(): h.JSX.CSSProperties {
        return {
            width: '100%',
            height: 'auto,'
        }
    }
    get canvasStyle(): h.JSX.CSSProperties {
        return {
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
        }
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
            case 'id':
                if (typeof newValue === 'string') {
                    modification[propery] = newValue.toUpperCase()
                }
                break;
        }
        this.setState(modification, () => {
            this.updateCanvas()
        })
    }

    saveToService() {
        const { state } = this

        if (!state.id) {
            this.setState({ saveWarning: 'NO ID' })
            return
        }
        if (!state.url) {
            this.setState({ saveWarning: 'NO FILE' })
            return
        }

        const copy = cloneData(state) as SpriteSheet & Partial<ExtraState>
        delete copy.urlIsObjectUrl
        delete copy.saveWarning

        this.setState({ saveWarning: undefined }, () => {
            spriteSheetService.add(copy)
            this.forceUpdate()
        })
    }

    openFromService(sheetId: string) {
        const sheet = spriteSheetService.get(sheetId)
        if (!sheet) { return }

        const copy = cloneData(sheet);

        this.setState(state => {
            const newState = {
                ...state,
                ...copy,
            }
            return newState
        }, this.updateCanvas)

    }

    render() {
        const {
            url, rows = 1, cols = 1, widthScale = 1, heightScale = 1, id = "", saveWarning
        } = this.state

        return (
            <article>
                <h2>SpriteSheetTool</h2>
                <div>
                    <button onClick={this.loadFile}>select image file</button>
                    <TextInput label="ID" value={id} onInput={event => this.changeValue('id', eventToString(event))} />
                </div>

                <div>
                    <NumberInput label="rows" value={rows} min={1}
                        onInput={
                            event => { this.changeValue('rows', eventToNumber(event)) }
                        }
                    />
                    <NumberInput label="cols" value={cols} min={1}
                        onInput={
                            event => { this.changeValue('cols', eventToNumber(event)) }
                        }
                    />
                </div>
                <div>
                    <NumberInput label="widthScale" value={widthScale} step={.1}
                        onInput={
                            event => { this.changeValue('widthScale', eventToNumber(event)) }
                        }
                    />
                    <NumberInput label="heightScale" value={heightScale} step={.1}
                        onInput={
                            event => { this.changeValue('heightScale', eventToNumber(event)) }
                        }
                    />
                </div>

                <figure style={this.frameStyle}>
                    <img src={url} style={this.imageStyle} />
                    <canvas ref={this.canvasRef} height={canvasScale} width={canvasScale} style={this.canvasStyle} />
                </figure>

                <div>
                    <button onClick={this.saveToService}>Save to service</button>
                    {saveWarning && (
                        <Warning>{saveWarning}</Warning>
                    )}
                </div>

                <div>
                    <h3>load existing sheet</h3>
                    <ul>
                        {spriteSheetService.list().map(id => <li key={id}>
                            <button onClick={() => { this.openFromService(id) }}>{id}</button>
                        </li>)}
                    </ul>
                </div>
            </article>
        )
    }
}
