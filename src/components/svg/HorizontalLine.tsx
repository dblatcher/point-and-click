import { FunctionComponent } from "react";
import { RoomData } from "@/definitions"

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
            strokeDasharray="4 3" />
        <text
            x={0}
            y={roomData.height - y}
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