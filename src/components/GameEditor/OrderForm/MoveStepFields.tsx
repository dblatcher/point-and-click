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
    positionSelectIsActive: boolean
    setStepBeingEdited: { (index: number | undefined): void }
}) => {
    const { step, index, animationSuggestions, changeStep, positionSelectIsActive, setStepBeingEdited } = props

    return <>
        <Box gap={1} display={'flex'} flexWrap={'wrap'}>
            <StringInput label="animation"
                notFullWidth
                minWidth={80}
                value={step.animation ?? ''}
                suggestions={animationSuggestions}
                inputHandler={(animation) => changeStep({ animation }, index)}
            />

            <OptionalNumberInput label="speed multiplier" notFullWidth
                value={step.speed}
                min={.1} max={10} step={.2}
                inputHandler={(speed) => changeStep({ speed }, index)}
            />
            <XYControl
                point={step}
                index={index}
                changePosition={(index, mod) => changeStep(mod, index)}
                positionSelectIsActive={positionSelectIsActive}
                handlePositionSelectButton={() => { setStepBeingEdited(positionSelectIsActive ? undefined : index) }}
            />
        </Box>
    </>
}