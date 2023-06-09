
import { ScaleLevel } from "@/definitions";
import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { cloneData } from "@/lib/clone"
import { ListEditor } from "../ListEditor";
import { clamp } from "@/lib/util";
import { Box, Stack } from "@mui/material";

interface Props {
    scaling: ScaleLevel;
    height: number;
    change: { (scaling: ScaleLevel): void };
}

export const ScalingControl = ({ scaling, height, change }: Props) => {

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
            stackSx={{maxWidth:300}}
            describeItem={(level, index) => {
                const [y, scale] = level
                return (
                    <Stack key={index} direction={'row'} spacing={2}>
                        <Box>
                            <NumberInput label="Y" value={y}
                                inputHandler={(value) => handleAdjustment(index, value, 'y')}
                                max={height} min={0} step={5} />
                        </Box>

                        <Box>
                            <NumberInput label="scale" value={scale}
                                inputHandler={(value) => handleAdjustment(index, value, 'scale')}
                                max={5} min={0} step={.1} />
                        </Box>
                    </Stack>
                )
            }}
            mutateList={change}
            createItem={addNew}
            createButton="END"
        />
    )
}