import { useGameDesign } from "@/context/game-design-context";
import { patchMember } from "@/lib/update-design";
import { modifyAt } from "@/lib/util";
import { Grid } from "@mui/material";
import { Sequence, Stage } from "point-click-lib";
import { DelayedStringInput } from "../DelayedStringInput";
import { ItemEditorHeaderControls } from "../game-item-components/ItemEditorHeaderControls";
import { EditorHeading } from "../layout/EditorHeading";
import { SequenceFlow } from "./SequenceFlow";


type Props = {
    data: Sequence;
    heading?: 'main' | 'externalSequence'
    handleChoiceSequenceChange?: { (sequence: Sequence): void }
}


export const SequenceEditor = (props: Props) => {
    const { applyModification, gameDesign } = useGameDesign()

    const updateFromPartial = (
        modification: Partial<Sequence>,
        description?: string
    ) => {
        const { data, handleChoiceSequenceChange } = props
        if (handleChoiceSequenceChange) {
            return handleChoiceSequenceChange({ ...data, ...modification })
        }
        applyModification(
            description ?? `update sequence ${data.id}`,
            { sequences: patchMember(data.id, modification, gameDesign.sequences) }
        )
    }

    const modifyStage = (mod: Partial<Stage>, stageIndex: number, description: string) => {
        updateFromPartial({
            stages: modifyAt(stageIndex, mod, sequence.stages)
        }, `sequence ${props.data.id}, stage#${stageIndex + 1}: ${description}`)
    }

    const { data: sequence, heading } = props

    const descriptionField = <DelayedStringInput label="description" value={sequence.description || ''}
        inputHandler={(description) => {
            updateFromPartial({ description })
        }}
    />

    return (
        <article>
            {heading === 'main' && (<>
                <EditorHeading heading="Sequence Editor" itemId={sequence?.id ?? '[new]'} >
                    <ItemEditorHeaderControls
                        dataItem={sequence}
                        itemType='sequences'
                        itemTypeName="sequence" />
                </EditorHeading>

                <Grid container spacing={4}>
                    <Grid item xs={8}>
                        {descriptionField}
                    </Grid>
                </Grid>
            </>)}

            {heading === 'externalSequence' &&
                (<>
                    <h3>Edit external sequence: </h3>
                    <div>ID: <b>{sequence?.id}</b></div>
                    {descriptionField}
                </>)
            }

            <SequenceFlow
                sequence={props.data}
                changeStages={(stages) => updateFromPartial({ stages })}
                modifyStage={modifyStage}
            />
        </article>
    )
}