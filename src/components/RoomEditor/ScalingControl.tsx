import { h } from "preact";
import { ScaleLevel } from "../../definitions/RoomData";
import { NumberInput } from "../formControls";
import { cloneData } from "../../lib/clone"

interface Props {
    scaling: ScaleLevel
    height: number
    change: { (scaling: ScaleLevel): void }
}

export function ScalingControl({ scaling, height, change }: Props) {

    const handleAdjustment = (
        index: number, value: number, property: 'scale' | 'y'
    ) => {
        const newScaling = cloneData(scaling)
        const propertyIndex = property === 'scale' ? 1 : 0;
        newScaling[index][propertyIndex] = value
        change(newScaling)
    }

    const handleDelete = (
        index: number
    ) => {
        const newScaling = cloneData(scaling)
        newScaling.splice(index, 1)
        change(newScaling)
    }

    const addNew = () => {
        const newScaling = cloneData(scaling)
        const last = newScaling[newScaling.length - 1]
        newScaling.push( last ? [last[0] + 5, last[1]] : [0,1])
        change(newScaling)
    }

    return (
        <section>
            {scaling.map((level, index) => {
                const [y, scale] = level
                return <div key={index}>
                    <NumberInput label="Y" value={y}
                        onInput={(event) => handleAdjustment(index, Number(event.target.value), 'y')}
                        max={height} min={0} step={5} />
                    <NumberInput label="scale" value={scale}
                        onInput={(event) => handleAdjustment(index, Number(event.target.value), 'scale')}
                        max={5} min={0} step={.1} />
                    <button onClick={() => handleDelete(index)}>delete</button>
                </div>
            })}
            <div><button onClick={addNew}>Add New</button></div>
        </section>
    )
}