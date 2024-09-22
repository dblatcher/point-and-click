import { eventToNumber } from "@/lib/util";
import { RangeInput } from "../RangeInput";

interface Props {
    viewAngle: number;
    setViewAngle: { (value: number): void }
}

export const ViewAngleSlider = ({ viewAngle, setViewAngle }: Props) => {
    return (
        <RangeInput
            label="preview angle"
            value={viewAngle}
            formattedValue={`${Math.sign(viewAngle) !== -1 ? '+' : '-'}${Math.abs(viewAngle).toFixed(2)}`}
            max={1} min={-1} step={.01}
            onChange={
                (event) => setViewAngle(eventToNumber(event.nativeEvent))
            } />
    )
}