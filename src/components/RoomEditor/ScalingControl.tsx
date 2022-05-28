import { RoomData } from "../../definitions/RoomData";

interface Props {
    scaling: RoomData['scaling']
}

export function ScalingControl({ scaling }: Props) {

    return (
        <ul>
            {scaling.map((level, index) => {
                const [y, scale] = level
                return <li key={index}>
                    <span>Y: <b>{y}</b></span>
                    &nbsp;
                    <span>scale: <b>{scale}</b></span>
                </li>
            })}
        </ul>
    )
}