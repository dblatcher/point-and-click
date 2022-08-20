/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionComponent, h } from "preact";
import { Room } from "../../Room";
import { ActorData, RoomData } from "../../.."
import { clamp } from "../../../lib/util";
import { getViewAngleCenteredOn, locateClickInWorld } from "../../../lib/roomFunctions";

interface Props {
    actorData: ActorData;
    otherActors: ActorData[];
    roomData?: RoomData;
    reportClick: { (point: { x: number; y: number }): void };
}

export const PositionPreview: FunctionComponent<Props> = ({ actorData, roomData, reportClick, otherActors }) => {

    const viewAngle = roomData ? clamp(getViewAngleCenteredOn(actorData.x, roomData), 1, -1) : 0

    const contents = [...otherActors, actorData]
        .sort((a, b) => b.y - a.y)
        .map(actor => ({ data: actor }))

    return (
        <section style={{
            display: 'inline-block',
            border: "1px solid black",
            padding: '.5em',
            cursor: 'crosshair',
            minHeight: 300,
        }}>
            {roomData && (
                <Room
                    data={roomData}
                    contents={contents}
                    viewAngle={viewAngle}
                    showObstacleAreas={true}

                    handleRoomClick={(x, y) => {
                        const point = locateClickInWorld(x, y, viewAngle, roomData)
                        reportClick({ x: Math.round(point.x), y: Math.round(point.y) })
                    }}
                    maxWidth={1000}
                    maxHeight={300}
                    forPreview={true}
                />
            )}
        </section>
    )
}