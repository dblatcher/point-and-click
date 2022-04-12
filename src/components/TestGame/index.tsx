import { useState } from "preact/hooks";
import { RoomData } from "../../lib/RoomData";
import { Room } from "../Room";

interface Props {
    data: RoomData,
}


export const TestGame = ({ data }: Props) => {

    const [x, setX] = useState(data.width/2)

    return (<main>
        <button onClick={()=>{setX(x-10)}}>left</button>
        <button onClick={()=>{setX(x+10)}}>right</button>
        <span>{x}</span>
        <Room data={data} scale={1.5} x={x} />
    </main>
    )

}