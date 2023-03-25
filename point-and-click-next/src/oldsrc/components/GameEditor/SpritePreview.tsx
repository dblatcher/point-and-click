
import { Component } from "react";
import { RoomData, ActorData } from "@/oldsrc";
import { Room } from "../Room";
import HorizontalLine from "../HorizontalLine";
import { Sprite } from "@/lib/Sprite";

const makeRoomData: { (actorData: ActorData): RoomData } = (actorData) => ({
    height: actorData.height  + 10,
    width: (actorData.width * 1.5) + 10,
    frameWidth: (actorData.width * 1.5) + 10,
    id: '',
    background: []
})

type State = {
    speed: number;
    maxWidth: number;
};

type Props = {
    data: ActorData;
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

        const modifiedActorData: ActorData = {
            ...data,
            x: roomData.width / 2
        }

        return (
            <Room data={roomData}
                showObstacleAreas={false}
                forPreview
                maxWidth={maxWidth}
                viewAngle={0}
                highlightHotspots={false}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                handleRoomClick={() => { }}
                contents={[{ overrideSprite, data: modifiedActorData, }]}
            >
                <HorizontalLine roomData={roomData} y={data.baseline || 0} />
            </Room>
        )
    }
}


