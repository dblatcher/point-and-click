/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionComponent, h } from "preact";
import { Room } from "../../Room";
import { CharacterData, RoomData } from "../../../."
import { clamp, getViewAngleCenteredOn, locateClickInWorld } from "../../../lib/util";

interface Props {
    characterData: CharacterData;
    otherCharacters: CharacterData[];
    roomData?: RoomData;
    reportClick: { (point: { x: number; y: number }): void };
}

export const PositionPreview: FunctionComponent<Props> = ({ characterData, roomData, reportClick, otherCharacters }) => {

    const viewAngle = roomData ? clamp(getViewAngleCenteredOn(characterData.x, roomData), 1, -1) : 0


    const contents = [
        ...otherCharacters.map(data => ({ data })),
        { data: characterData }
    ].sort((a, b) => b.data.y - a.data.y)



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