import HorizontalLine from "@/components/svg/HorizontalLine";
import { Room } from "@/components/svg/Room";
import { ActorData, Direction, RoomData } from "@/definitions";
import { Sprite } from "@/lib/Sprite";

type Props = {
    data: ActorData;
    overrideSprite?: Sprite;
    scale?: number;
    noBaseLine?: boolean;
    maxHeight?: number;
    animation?: string;
    direction?: Direction;
}

const makeRoomData = (data: ActorData, scale: number): RoomData => ({
    height: (scale * data.height),
    width: (scale * data.width * 1.5) + 10,
    frameWidth: (scale * data.width * 1.5) + 10,
    id: '',
    background: []
})

const getscale = (actor: ActorData, scale: number, maxHeight?: number) => {
    if (!maxHeight) {
        return scale
    }
    return maxHeight / actor.height
}

export const SpritePreview = ({ data, overrideSprite, scale = 1, noBaseLine, maxHeight, animation, direction }: Props) => {

    const effectiveScale = getscale(data, scale, maxHeight)
    const roomData = makeRoomData(data, effectiveScale)

    const modifiedActorData: ActorData = {
        ...data,
        width: effectiveScale * data.width,
        height: effectiveScale * data.height,
        x: roomData.width / 2,
        status: animation ?? data.status,
        direction: direction ?? data.direction,
        y: 0
    }

    const maxWidth = maxHeight ? roomData.width : 100 * scale
    return (
        <Room data={roomData}
            renderAllZones={false}
            noSound
            noMargin
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

