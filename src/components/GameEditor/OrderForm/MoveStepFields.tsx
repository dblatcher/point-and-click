import { OptionalNumberInput } from "@/components/SchemaForm/OptionalNumberInput"
import { StringInput } from "@/components/SchemaForm/StringInput"
import { MoveStep } from "@/definitions/Order"
import { Box, Collapse, IconButton, Typography } from "@mui/material"
import { XYControl } from "../XYControl"
import { useState } from "react"
import { ExpandMoreIcon } from "../material-icons"

export const MoveStepFields = (props: {
    index: number,
    animationSuggestions?: string[],
    changeStep: { (mod: Partial<MoveStep>, index: number): void },
    step: MoveStep
    positionSelectIsActive: boolean
    setStepBeingEdited: { (index: number | undefined): void }
}) => {
    const { step, index, animationSuggestions, changeStep, positionSelectIsActive, setStepBeingEdited } = props
    const [showDetails, setShowDetails] = useState(false)

    return <>
        <Box gap={1} display={'flex'} flexWrap={'wrap'} alignItems={'center'}>
            <Typography>{index + 1}</Typography>
            <XYControl
                point={step}
                index={index}
                changePosition={(index, mod) => changeStep(mod, index)}
                positionSelectIsActive={positionSelectIsActive}
                handlePositionSelectButton={() => { setStepBeingEdited(positionSelectIsActive ? undefined : index) }}
            />
            <IconButton onClick={() => setShowDetails(!showDetails)}>
                <ExpandMoreIcon sx={{
                    transition: '',
                    rotate: showDetails ? '180deg' : '0deg'
                }} />
            </IconButton>
        </Box>
        <Collapse in={showDetails} >
            <Box>
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
            </Box>
        </Collapse>
    </>
}