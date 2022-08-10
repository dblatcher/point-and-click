/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionComponent, h } from "preact";
import { Room } from "../../Room";
import { CharacterData, RoomData } from "../../../."
import { clamp, getViewAngleCenteredOn, locateClickInWorld } from "../../../lib/util";

interface Props {
    characterData: CharacterData;
    roomData?: RoomData;
    reportClick: { (point: { x: number; y: number }): void };
}

export const PositionPreview: FunctionComponent<Props> = ({ characterData, roomData, reportClick }) => {

    const viewAngle = roomData ? clamp(getViewAngleCenteredOn(characterData.x, roomData), 1, -1) : 0

    return (
        <section>
            {roomData && (
                <Room
                    data={roomData}
                    contents={[{ data: characterData }]}
                    viewAngle={viewAngle}
                    showObstacleAreas={true}

                    handleRoomClick={(x, y) => {
                        const point = locateClickInWorld(x, y, viewAngle, roomData)
                        reportClick({ x: Math.round(point.x), y: Math.round(point.y) })
                    }}
                />
            )}
        </section>
    )
}