import { RoomData, ActorData } from "@/definitions";
import { Room } from "@/components/svg/Room";
import HorizontalLine from "@/components/svg/HorizontalLine";
import { Sprite } from "@/lib/Sprite";

type Props = {
    data: ActorData;
    overrideSprite?: Sprite;
    scale?: number;
    noBaseLine?: boolean;
}

const makeRoomData = (data: ActorData, scale: number): RoomData => ({
    height: (scale * data.height) + 10,
    width: (scale * data.width * 1.5) + 10,
    frameWidth: (scale * data.width * 1.5) + 10,
    id: '',
    background: []
})

export const SpritePreview = ({ data, overrideSprite, scale = 1, noBaseLine }: Props) => {
    const maxWidth = 100 * scale
    const roomData = makeRoomData(data, scale)
    const modifiedActorData: ActorData = {
        ...data,
        width: scale * data.width,
        height: scale * data.height,
        x: roomData.width / 2
    }
    return (
        <Room data={roomData}
            showObstacleAreas={false}
            forPreview
            maxWidth={maxWidth}
            viewAngle={0}
            highlightHotspots={false}
            handleRoomClick={() => { }}
            contents={[{ overrideSprite, data: modifiedActorData, }]}
        >
            {!noBaseLine && (
                <HorizontalLine roomData={roomData} y={data.baseline || 0} />
            )}
        </Room>
    )
}

