import { OptionalNumberInput } from "@/components/SchemaForm/OptionalNumberInput"
import { StringInput } from "@/components/SchemaForm/StringInput"
import { MoveStep } from "@/definitions/Order"
import { Box } from "@mui/material"
import { XYControl } from "../XYControl"

export const MoveStepFields = (props: {
    index: number,
    animationSuggestions?: string[],
    changeStep: { (mod: Partial<MoveStep>, index: number): void },
    step: MoveStep
}) => {
    const { step, index, animationSuggestions, changeStep } = props

    return <>
        <Box gap={1} display={'flex'} flexWrap={'wrap'}>
            <StringInput label="animation"
                notFullWidth
                minWidth={80}
                value={step.animation ?? ''}
                suggestions={animationSuggestions}
                inputHandler={(animation) => changeStep({ animation }, index)}
            />

            <OptionalNumberInput label="speed"
                value={step.speed}
                inputHandler={(speed) => changeStep({ speed }, index)}
            />
            <XYControl point={step} index={index} changePosition={(index, mod) => changeStep(mod, index)} />
        </Box>
    </>
}