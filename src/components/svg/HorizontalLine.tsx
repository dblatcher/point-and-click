import { FunctionComponent } from "react";
import { useRoomRender } from "@/hooks/useRoomRender";

interface Props {
    y: number;
    color?: string;
    text?: string;
}

const HorizontalLine: FunctionComponent<Props> = ({
    color = 'red', y = 0, text
}: Props) => {
    const { surfaceYShift, roomData } = useRoomRender()
    const textToDisplay = text || y.toFixed(0)
    const plotY = roomData.height - y + surfaceYShift;

    return (<>
        <line
            x1={0}
            y1={plotY}
            x2={roomData.frameWidth}
            y2={plotY}
            stroke={color}
            strokeDasharray="4 3" />
        <text
            x={0}
            y={plotY}
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