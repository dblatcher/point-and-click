/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import { RoomData } from "../../definitions/RoomData";
import { CharacterData } from "../../definitions/CharacterData";
import { Room } from "../Room";

import { Sprite } from "../../lib/Sprite";

const makeRoomData: { (characterData: CharacterData): RoomData } = (characterData) => ({
    height: characterData.height + 10,
    width: characterData.width + 10,
    frameWidth: characterData.width + 10,
    name: '',
    background: []
})

type State = {
    speed: number;
    maxWidth: number;
};

type Props = {
    data: CharacterData;
    overrideSprite?: Sprite;
}


export class SpritePreview extends Component<Props, State>{

    constructor(props: SpritePreview['props']) {
        super(props)
        this.state = {
            maxWidth: 100,
            speed: 1
        }
    }

    render() {
        const { maxWidth } = this.state
        const { data, overrideSprite } = this.props

        const roomData = makeRoomData(data)

        return (
            <Room data={roomData}
                showObstacleAreas={false}
                maxWidth={maxWidth}
                viewAngle={0}
                highlightHotspots={false}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                handleRoomClick={() => { }}
                contents={[{ overrideSprite, data, }]}
            />
        )
    }
}


