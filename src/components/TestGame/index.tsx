import { useState } from "preact/hooks";
import { RoomData, Zone } from "../../lib/RoomData";
import { Room } from "../Room";

import { useInterval } from "../../lib/useInterval"
import { getViewAngleCenteredOn, clamp, locateClickInWorld } from "../../lib/util";
import { usePosition } from "../../lib/usePosition";


interface Props {
    data: RoomData,
}

const speed = 2

export const TestGame = ({ data }: Props) => {

    const [viewAngle, setViewAngle] = useState(0)
    const markerPosition = usePosition(data.width / 2, 0)
    const markerDestination = usePosition(data.width / 2, 0)

    const moveHorizontalStep = (speed: number) => {
        if (markerPosition.x !== markerDestination.x) {
            const distance = Math.min(speed, Math.abs(markerPosition.x - markerDestination.x))
            const direction = markerPosition.x < markerDestination.x ? 1 : -1
            markerPosition.x = markerPosition.x + (distance * direction)
        }
    }
    const moveVerticalStep = (speed: number) => {
        if (markerPosition.y !== markerDestination.y) {
            const distance = Math.min(speed, Math.abs(markerPosition.y - markerDestination.y))
            const direction = markerPosition.y < markerDestination.y ? 1 : -1
            markerPosition.y = markerPosition.y + (distance * direction)
        }
    }

    const followMarker = () => {
        setViewAngle(clamp(getViewAngleCenteredOn(markerPosition.x, data), 1, -1))
    }

    useInterval(() => {
        moveHorizontalStep(speed)
        moveVerticalStep(speed)
        followMarker()
    }, 10)

    const handleRoomClick = (x, y) => {
        const vX = locateClickInWorld(x, viewAngle, data)
        markerDestination.x = vX
        markerDestination.y = data.height - y
    }
    const handleHotSpotClick = (zone: Zone) => {
        console.log('hotspot click', zone.name)
    }

    return (
        <main>
            <div>
                <button onClick={() => {
                    markerPosition.x = (markerPosition.x - 10)
                    markerDestination.x = (markerPosition.x - 10)
                }}>left</button>
                <span>position {markerPosition.x}</span>
                <button onClick={() => {
                    markerPosition.x = markerPosition.x + 10
                    markerDestination.x = markerPosition.x + 10
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
                data={data} scale={2} markerX={markerPosition.xState} markerY={markerPosition.yState}
                viewAngle={viewAngle}
                handleRoomClick={handleRoomClick}
                handleHotSpotClick={handleHotSpotClick} />
        </main>
    )
}
