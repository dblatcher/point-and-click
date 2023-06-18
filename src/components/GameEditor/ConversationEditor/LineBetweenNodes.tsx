import { useEffect, useState } from "react";

type Coordinates = {
    w: number;
    h: number;
    l: number;
    t: number;
    lineToTopRight: boolean;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

const determineCoordinates = (startNode: Element, endNode: Element, container: HTMLElement): Coordinates => {
    const containerBox = container.getBoundingClientRect()
    const choiceBox = startNode.getBoundingClientRect()
    const branchBox = endNode.getBoundingClientRect()
    let startX = choiceBox.left - containerBox.left
    const startY = choiceBox.top - containerBox.top + choiceBox.height / 2
    const endX = branchBox.left + branchBox.width / 2 - containerBox.left
    let endY = branchBox.top - containerBox.top

    const goingRight = startX < endX
    const goingUp = startY > endY
    if (goingRight) {
        startX += choiceBox.width
    }
    if (goingUp) {
        endY += branchBox.height
    }
    const lineToTopRight = (goingRight && goingUp) || (!goingRight && !goingUp)

    const w = Math.abs(startX - endX)
    const h = Math.abs(startY - endY)
    const l = Math.min(startX, endX)
    const t = Math.min(startY, endY)
    return { w, h, l, t, lineToTopRight, startX, startY, endX, endY }
}


export const LineBetweenNodes = ({ startNode, endNode, container }: { startNode: Element; endNode: Element; container: HTMLElement }) => {
    const [coords, setCoords] = useState<Coordinates>(determineCoordinates(startNode, endNode, container))
    const updateCoords = () => {
        setCoords(determineCoordinates(startNode, endNode, container))
    }

    useEffect(() => {
        window.addEventListener('resize', updateCoords)
        return () => {
            window.removeEventListener('resize', updateCoords)
        }
    })
    const { w, h, l, t, lineToTopRight, endX: endX, endY: endY } = coords

    return (<>
        <div style={{
            position: 'absolute',
            width: w,
            height: h,
            left: l,
            top: t,
            overflow: "visible",
            pointerEvents: 'none',
        }}>
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio='none'
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',

                }}>
                {lineToTopRight ?
                    <line x1={100} y1={0} x2={0} y2={100} stroke="black" strokeDasharray={'2 2'} />
                    :
                    <line x1={0} y1={0} x2={100} y2={100} stroke="black" strokeDasharray={'2 2'}/>
                }
            </svg>
        </div>

        <div style={{
            position: 'absolute',
            width: 20,
            height: 20,
            left: endX - 10,
            top: endY - 10,
            overflow: "visible",
            pointerEvents: 'none',
        }}>
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 'inherit',
                    height: 'inherit',
                }}
            >
                <circle cx={50} cy={50} r={50} fill="red" />
            </svg>
        </div>
    </>
    )
}