import { FunctionComponent, useState } from "react";
import { Room } from "@/components/svg/Room";
import { MarkerShape } from "@/components/svg/MarkerShape";
import { ActorData, RoomData } from "@/oldsrc"
import { clamp } from "@/lib/util";
import { getTargetPoint, getViewAngleCenteredOn, locateClickInWorld, putActorsInDisplayOrder } from "@/lib/roomFunctions";

type PointRole = 'position' | 'walkTo';

interface Props {
    actorData: ActorData;
    otherActors: ActorData[];
    roomData?: RoomData;
    reportClick: { (point: { x: number; y: number }, pointRole: PointRole): void };
}

export const PositionPreview: FunctionComponent<Props> = ({ actorData, roomData, reportClick, otherActors }) => {

    const [role, setRole] = useState<PointRole>('position')

    const viewAngle = roomData ? clamp(getViewAngleCenteredOn(actorData.x, roomData), 1, -1) : 0

    const contents = [...otherActors, actorData]
        .sort(putActorsInDisplayOrder)
        .map(actor => ({ data: actor }))



    return (
        <section style={{
            display: 'inline-block',
            border: "1px solid black",
            padding: '.5em',
            cursor: 'crosshair',
            minHeight: 300,
            minWidth: 200,
            position: 'relative',
        }}>
            {roomData && (
                <Room
                    data={roomData}
                    contents={contents}
                    viewAngle={viewAngle}
                    showObstacleAreas={true}

                    handleRoomClick={(x, y) => {
                        const point = locateClickInWorld(x, y, viewAngle, roomData)
                        reportClick({ x: Math.round(point.x), y: Math.round(point.y) }, role)
                    }}
                    maxWidth={1000}
                    maxHeight={300}
                    forPreview={true}
                >
                    <MarkerShape
                        roomData={roomData}
                        viewAngle={viewAngle}
                        color={'red'}
                        // text={this.walkToPointLabel}
                        {...getTargetPoint(actorData, roomData)}
                    />
                </Room>

            )}
            <nav style={{
                position: 'absolute',
                display: 'inlineBlock',
                top: 0,
                left: 0,
            }}>
                <button onClick={() => { setRole('position') }}
                    style={{
                        cursor: 'pointer',
                        fontWeight: role === 'position' ? 700 : 400
                    }}
                >
                    position
                </button>
                <button onClick={() => { setRole('walkTo') }}
                    style={{
                        cursor: 'pointer',
                        fontWeight: role === 'walkTo' ? 700 : 400
                    }}
                >
                    walkTo
                </button>
            </nav>
        </section>
    )
}