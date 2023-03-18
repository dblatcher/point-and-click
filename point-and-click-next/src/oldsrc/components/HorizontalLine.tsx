import { FunctionComponent } from "react";
import { RoomData } from "../"

interface Props {
    roomData: RoomData;
    y: number;
    color?: string;
    text?: string;
}

const HorizontalLine: FunctionComponent<Props> = ({
    roomData, color = 'red', y = 0, text
}: Props) => {
    const textToDisplay = text || y.toFixed(0)

    return (<>
        <line x1={0} y1={roomData.height - y} 
            x2={roomData.frameWidth} y2={roomData.height - y} 
            stroke={color} 
            stroke-dasharray="4 3" />
        <text
            x={0}
            y={roomData.height - y}
            stroke={'white'}
            fill={'black'}
            stroke-width={.25}
            font-size={15}
            font-family='monospace'
        >{textToDisplay}</text>
    </>
    )
}
export default HorizontalLine