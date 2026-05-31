import { Pin } from "./Pin";

interface Props {
    radius:number
}


export const CirclePins = ({  }: Props) => {
    
    return (
        <Pin label={"C"} x={0} y={0} />
    )
}