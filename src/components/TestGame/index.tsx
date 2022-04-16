import { useState } from "preact/hooks";
import { RoomData, Zone } from "../../lib/RoomData";
import { Room } from "../Room";

import { useInterval } from "../../lib/useInterval"
import { getShift } from "../../lib/util";


interface Props {
    data: RoomData,
}

const speed = 2

export const TestGame = ({ data }: Props) => {

    const [viewAngle, setViewAngle] = useState(0)
    const [xCurrent, setCurrentX] = useState(0)
    const [xDestination, setXDestination] = useState(0)

    useInterval(() => {
        moveHorizontalStep(xCurrent, xDestination, speed)
    }, 10)

    const handleRoomClick = (x, y) => {
        const vX = x - getShift(viewAngle,1,data)
        console.log('room click', x, y)
        setXDestination(vX)
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
            <div>
                <button onClick={() => {
                    setCurrentX(xCurrent - 10)
                    setXDestination(xCurrent - 10)
                }}>left</button>
                <span>position {xCurrent}</span>
                <button onClick={() => {
                    setCurrentX(xCurrent + 10)
                    setXDestination(xCurrent + 10)
                }}>right</button>
            </div>

            <div>
                <button onClick={() => {
                    setViewAngle(viewAngle + .1)
                }}>&larr;</button>
                <span>viewAngle {viewAngle.toFixed(3)}</span>
                <button onClick={() => {
                    setViewAngle(viewAngle - .1)
                }}>&rarr;</button>
            </div>

            <Room
                data={data} scale={2} markerX={xCurrent}
                viewAngle={viewAngle}
                handleRoomClick={handleRoomClick}
                handleZoneClick={handleZoneClick} />
        </main>
    )

}