import { useState } from "preact/hooks";
import { RoomData, Zone } from "../../lib/RoomData";
import { Room } from "../Room";

import { useInterval } from "../../lib/useInterval"
import { getViewAngleCenteredOn, clamp, locateClickInWorld } from "../../lib/util";


interface Props {
    data: RoomData,
}

const speed = 2

export const TestGame = ({ data }: Props) => {

    const [viewAngle, setViewAngle] = useState(0)
    const [xCurrent, setCurrentX] = useState(data.width / 2)
    const [xDestination, setXDestination] = useState(xCurrent)
    const [yCurrent, setCurrentY] = useState(0)
    const [yDestination, setYDestination] = useState(yCurrent)

    const moveHorizontalStep = (speed: number) => {
        if (xCurrent !== xDestination) {
            const distance = Math.min(speed, Math.abs(xCurrent - xDestination))
            const direction = xCurrent < xDestination ? 1 : -1
            setCurrentX(xCurrent + (distance * direction))
        }
    }
    const moveVerticalStep = (speed: number) => {
        if (yCurrent !== yDestination) {
            const distance = Math.min(speed, Math.abs(yCurrent - yDestination))
            const direction = yCurrent < yDestination ? 1 : -1
            setCurrentY(yCurrent + (distance * direction))
        }
    }

    const followMarker = () => {
        setViewAngle(clamp(getViewAngleCenteredOn(xCurrent, data), 1, -1))
    }

    useInterval(() => {
        moveHorizontalStep(speed)
        moveVerticalStep(speed)
        followMarker()
    }, 10)

    const handleRoomClick = (x, y) => {
        const vX = locateClickInWorld(x, viewAngle, data)
        setXDestination(vX)
        setYDestination(data.height - y)
    }
    const handleHotSpotClick = (zone: Zone) => {
        console.log('hotspot click', zone.name)
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
                    setViewAngle(Math.min(1, viewAngle + .1))
                }}>&larr;</button>
                <span>viewAngle {viewAngle.toFixed(3)}</span>
                <button onClick={() => {
                    setViewAngle(Math.max(-1, viewAngle - .1))
                }}>&rarr;</button>
            </div>

            <Room
                data={data} scale={2} markerX={xCurrent} markerY={yCurrent}
                viewAngle={viewAngle}
                handleRoomClick={handleRoomClick}
                handleHotSpotClick={handleHotSpotClick} />
        </main>
    )

}