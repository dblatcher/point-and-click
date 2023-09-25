import { useGameDesign } from "@/context/game-design-context";
import { Consequence } from "@/definitions";
import { findById } from "@/lib/util";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { ConsequenceForm } from "../InteractionEditor/ConsequenceForm";

interface Props {
    sequenceId: string
    stage: number
    index: number
    changeConsequence: { (consequence: Consequence, stageIndex: number, consequenceIndex: number): void }
    close: { (): void }
}



export const ConsequenceDialog = ({ sequenceId, stage, index, close, changeConsequence }: Props) => {
    const { gameDesign } = useGameDesign()
    const sequence = findById(sequenceId, gameDesign.sequences)
    const consequence = sequence?.stages[stage].immediateConsequences?.[index]

    return (
        <Dialog open={!!consequence} onClose={close}>
            <DialogTitle>edit consequence</DialogTitle>
            <DialogContent>
                {consequence && (
                    <ConsequenceForm
                        consequence={consequence}
                        immediateOnly
                        update={(consequence) => {
                            changeConsequence(consequence, stage, index)
                        }}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}