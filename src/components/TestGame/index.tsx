import { useState } from "preact/hooks";
import { RoomData, Zone } from "../../lib/RoomData";
import { Room } from "../Room";

interface Props {
    data: RoomData,
}


export const TestGame = ({ data }: Props) => {

    const [x, setX] = useState(0)

    const handleRoomClick = (x, y) => {
        console.log('room click', x, y)
        setX(x)
    }
    const handleZoneClick = (zone: Zone) => {
        console.log('zone click', zone)
    }

    return (
        <main>
            <button onClick={() => { setX(x - 10) }}>left</button>
            <button onClick={() => { setX(x + 10) }}>right</button>
            <span>{x}</span>
            <Room
                data={data} scale={2.5} x={x}
                handleRoomClick={handleRoomClick}
                handleZoneClick={handleZoneClick} />
        </main>
    )

}