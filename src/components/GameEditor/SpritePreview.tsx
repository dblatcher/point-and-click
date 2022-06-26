/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import { RoomData } from "../../definitions/RoomData";
import { CharacterOrThing } from "../CharacterOrThing";
import { ThingData } from "../../definitions/ThingData";
import { Room } from "../Room";
import { CharacterData } from "../../definitions/CharacterData";
import { Sprite } from "../../lib/Sprite";

const makeRoomData: { (thingData: ThingData | CharacterData): RoomData } = (thingData) => ({
    height: thingData.height + 10,
    width: thingData.width + 10,
    frameWidth: thingData.width + 10,
    name: '',
    background: []
})

type State = {
    speed: number;
    viewScale: number;
};

type Props = {
    data: CharacterData | ThingData;
    overrideSprite?: Sprite;
}


export class SpritePreview extends Component<Props, State>{

    constructor(props: SpritePreview['props']) {
        super(props)
        this.state = {
            viewScale: 1,
            speed: 1
        }
    }

    render() {
        const {
            viewScale
        } = this.state
        const { data, overrideSprite } = this.props

        const roomData = makeRoomData(data)

        return (
            <Room data={roomData}
                showObstacleAreas={false}
                scale={viewScale}
                viewAngle={0}
                highlightHotspots={false}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                handleRoomClick={() => { }}
            >
                <CharacterOrThing
                    overrideSprite={overrideSprite}
                    key={1}
                    data={data}
                    roomData={roomData}
                    viewAngle={0} isPaused={false} />
            </Room>
        )
    }
}


