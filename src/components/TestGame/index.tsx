import { useState } from "preact/hooks";
import { RoomData, Zone } from "../../lib/RoomData";
import { Room } from "../Room";

import { useInterval } from "../../lib/useInterval"


interface Props {
    data: RoomData,
}

const speed = 2

export const TestGame = ({ data }: Props) => {

    const [xCurrent, setCurrentX] = useState(0)
    const [xDestination, setXDestination] = useState(0)

    useInterval(() => {
        moveHorizontalStep(xCurrent, xDestination, speed)
    }, 10)

    const handleRoomClick = (x, y) => {
        console.log('room click', x, y)
        setXDestination(x)
    }
    const handleZoneClick = (zone: Zone) => {
        console.log('zone click', zone.name)
    }

    const moveHorizontalStep = (current: number, destination: number, speed: number) => {

        if (current !== destination) {
            const distance = Math.min(speed, Math.abs(current - destination))
            const direction = current < destination ? 1 : -1
            setCurrentX(current + (distance * direction))
        }
    }



    return (
        <main>
            <button onClick={() => {
                setCurrentX(xCurrent - 10)
                setXDestination(xCurrent - 10)
            }}>left</button>
            <button onClick={() => {
                setCurrentX(xCurrent + 10)
                setXDestination(xCurrent + 10)
            }}>right</button>
            <span>{xCurrent}</span>
            <Room
                data={data} scale={2.5} x={xCurrent}
                handleRoomClick={handleRoomClick}
                handleZoneClick={handleZoneClick} />
        </main>
    )

}