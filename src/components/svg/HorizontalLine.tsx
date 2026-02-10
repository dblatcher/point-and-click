import { FunctionComponent } from "react";
import { useRoomRender } from "point-click-components";

interface Props {
    y: number;
    color?: string;
    text?: string;
}

const HorizontalLine: FunctionComponent<Props> = ({
    color = 'red', y = 0, text
}: Props) => {
    const { roomData } = useRoomRender()
    const textToDisplay = text || y.toFixed(0)
    const invertedY = roomData.height - y

    return (<>
        <line
            x1={0}
            y1={invertedY}
            x2={roomData.width}
            y2={invertedY}
            stroke={color}
            strokeDasharray="4 3" />
        <text
            x={roomData.width / 2}
            y={invertedY < 50 ? invertedY + 15 : invertedY}
            stroke={'white'}
            fill={'black'}
            strokeWidth={.25}
            fontSize={15}
            fontFamily='monospace'

        >{textToDisplay}</text>
    </>
    )
}
export default HorizontalLine