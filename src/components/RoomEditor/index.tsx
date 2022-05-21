import { Component } from "preact";
import { BackgroundLayer, RoomData } from "../../definitions/RoomData";
import { SupportedZoneShape } from "../../definitions/Zone";
import { locateClickInWorld } from "../../lib/util";
import { Room } from "../Room";
import { BackgroundLayerControl } from "./BackgroundLayerControl";
import { BackgroundLayerForm } from "./BackgroundLayerForm";
import { ObstacleControl } from "./ObstacleControl";


type RoomEditorState = RoomData & {
    viewAngle: number,
    assetList: string[],
    viewScale: number,
    showObstacleAreas: boolean,
};

const path = "/assets/backgrounds/"
function getAssets(): string[] {
    return [
        "square-room.png",
        "hill.png",
        "indoors.png",
        "sky.png",
        "trees.png",
    ].map(filename => path + filename)
}

function getBlankRoom(): RoomData {
    return {
        name: '_NEW_',
        frameWidth: 200,
        width: 300,
        height: 200,
        background: [],
        hotspots: [],
        obstacleAreas: [
            { x: 100, y: 50, circle: 30 },
            { x: 130, y: 110, rect: [30,50] },
        ],
    }
}

export class RoomEditor extends Component<{}, RoomEditorState>{

    constructor(props: RoomEditor['props']) {
        super(props)
        const assets = getAssets()

        this.state = {
            ...getBlankRoom(),
            viewAngle: 0,
            viewScale: 1,
            assetList: assets,
            showObstacleAreas: true,
        }

        this.removeBackground = this.removeBackground.bind(this)
        this.addBackground = this.addBackground.bind(this)
        this.changeBackground = this.changeBackground.bind(this)
        this.moveBackground = this.moveBackground.bind(this)
        this.removeObstacle = this.removeObstacle.bind(this)
        this.moveObstacle = this.moveObstacle.bind(this)
        this.changeObstacle = this.changeObstacle.bind(this)
        this.handleRoomClick = this.handleRoomClick.bind(this)
    }

    handleRoomClick(x: number, y: number) {
        const pointClicked = locateClickInWorld(x, y, this.state.viewAngle, this.state)
        console.log(pointClicked)
    }

    removeObstacle(index: number) {
        const { obstacleAreas } = this.state
        obstacleAreas.splice(index, 1)
        this.setState({ obstacleAreas })
    }
    moveObstacle(index: number, x: number, y: number) {
        const { obstacleAreas } = this.state
        const obstacle = obstacleAreas[index]
        obstacle.x = x
        obstacle.y = y
        this.setState({ obstacleAreas })
    }
    changeObstacle(index: number, propery: SupportedZoneShape, newValue: any) {
        const { obstacleAreas } = this.state
        const obstacle = obstacleAreas[index]
        if (typeof obstacle[propery] === 'undefined') { return }
        obstacle[propery] = newValue
        this.setState({ obstacleAreas })
    }
    removeBackground(index: number) {
        const { background } = this.state
        background.splice(index, 1)
        this.setState({ background })
    }
    changeBackground(index: number, propery: string, newValue: any) {
        const { background } = this.state
        const layer = background[index]
        if (typeof layer[propery] === 'undefined') { return }
        layer[propery] = newValue
        this.setState({ background })
    }
    addBackground(newLayer: BackgroundLayer) {
        const { background } = this.state
        background.push(newLayer)
        this.setState({ background })
    }
    moveBackground(index: number, direction: 'UP' | 'DOWN') {
        const { background } = this.state
        if (direction === 'UP' && index === 0) { return }
        if (direction === 'DOWN' && index === background.length - 1) { return }
        const [layer] = background.splice(index, 1)
        background.splice(direction === 'DOWN' ? index + 1 : index - 1, 0, layer)
        this.setState({ background })
    }

    render() {
        const { viewAngle, viewScale, assetList, showObstacleAreas,
            name, background, height, width, frameWidth, obstacleAreas
        } = this.state

        return <article>
            <h2>Room Editor</h2>

            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <section>
                    <fieldset>
                        <legend>Name</legend>
                        <input value={name} onInput={event => this.setState({ name: event.target.value })} />
                    </fieldset>

                    <fieldset>
                        <legend>Dimensions</legend>
                        <div>
                            <label>height</label>
                            <input type='number' value={height} onInput={event => this.setState({ height: Number(event.target.value) })} />
                        </div>
                        <div>
                            <label>width</label>
                            <input type='number' value={width} onInput={event => this.setState({ width: Number(event.target.value) })} />
                        </div>
                        <div>
                            <label>frameWidth</label>
                            <input type='number' value={frameWidth} onInput={event => this.setState({ frameWidth: Number(event.target.value) })} />
                            {frameWidth > width && (
                                <span>! frame width is bigger than room width</span>
                            )}
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>Background</legend>
                        {background.map(
                            (layer, index) =>
                                <BackgroundLayerControl index={index}
                                    urls={assetList}
                                    layer={layer}
                                    remove={this.removeBackground}
                                    change={this.changeBackground}
                                    move={this.moveBackground}
                                />
                        )}

                        <BackgroundLayerForm
                            urls={assetList}
                            addNewLayer={this.addBackground} />
                    </fieldset>

                    <fieldset>
                        <legend>Obstacles</legend>
                        {obstacleAreas.map((obstacle, index) =>
                            <ObstacleControl
                                obstacle={obstacle} index={index}
                                move={this.moveObstacle}
                                change={this.changeObstacle}
                                remove={this.removeObstacle} />
                        )}
                    </fieldset>
                </section>
                <section>

                    <Room data={this.state}
                        showObstacleAreas={showObstacleAreas}
                        scale={viewScale}
                        viewAngle={viewAngle}
                        handleHotSpotClick={() => { }}
                        handleRoomClick={this.handleRoomClick}
                    />

                    <div>
                        <label>view scale</label>
                        <input type='range' value={viewScale} max={2} min={1} step={.01} onChange={(event) => this.setState({ viewScale: event.target.value })} />
                        <span>{viewScale}</span>
                    </div>

                    <div>
                        <label>view angle</label>
                        <input type='range' value={viewAngle} max={1} min={-1} step={.01} onChange={(event) => this.setState({ viewAngle: event.target.value })} />
                        <span>{viewAngle}</span>
                    </div>
                    <div>
                        <label>show obstables</label>
                        <input type='checkbox' checked={showObstacleAreas} onChange={(event) => this.setState({ showObstacleAreas: event.target.checked })} />
                        <span>{showObstacleAreas ? 'YES' : 'NO'}</span>
                    </div>
                </section>
            </div>

        </article>
    }
}