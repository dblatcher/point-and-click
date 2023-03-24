/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionComponent } from "react";
import { ScaleLevel } from "@/oldsrc";
import { NumberInput } from "../formControls";
import { cloneData } from "../../../../lib/clone"
import { ListEditor } from "../ListEditor";
import { clamp } from "../../../../lib/util";

interface Props {
    scaling: ScaleLevel;
    height: number;
    change: { (scaling: ScaleLevel): void };
}

export const ScalingControl: FunctionComponent<Props> = ({ scaling, height, change }: Props) => {

    const handleAdjustment = (
        index: number, value: number, property: 'scale' | 'y'
    ) => {
        const newScaling = cloneData(scaling)
        const propertyIndex = property === 'scale' ? 1 : 0;
        newScaling[index][propertyIndex] = value
        change(newScaling)
    }

    const addNew = (): [number, number] => {
        const last = scaling[scaling.length - 1]
        return last ? [last[0] + 15, clamp(last[1] - .1, height)] : [0, 1]
    }

    return (
        <ListEditor
            list={scaling}
            describeItem={(level, index) => {
                const [y, scale] = level
                return <div key={index}>
                    <NumberInput label="Y" value={y}
                        inputHandler={(value) => handleAdjustment(index, value, 'y')}
                        max={height} min={0} step={5} />
                    <NumberInput label="scale" value={scale}
                        inputHandler={(value) => handleAdjustment(index, value, 'scale')}
                        max={5} min={0} step={.1} />
                </div>
            }}
            mutateList={change}
            createItem={addNew}
            createButton="END"
        />
    )
}