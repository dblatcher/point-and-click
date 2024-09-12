import React, { useState } from "react";
import { InteractionIcon } from '@/components/GameEditor/material-icons';
import { Button } from "@mui/material";
import { InteractionDialog } from "./InteractionEditor/InteractionDialog";
import { useGameDesign } from "@/context/game-design-context";
import { Interaction } from "@/definitions";
import { PickInteractionDialog } from "./InteractionEditor/PickInteractionDialog";

interface Props {
    newPartial: Partial<Interaction>
    criteria: { (interaction: Interaction): boolean }
    disabled?: boolean;
}

export const InteractionsDialogsButton: React.FunctionComponent<Props> = ({ newPartial, criteria, disabled }) => {
    const { gameDesign, changeInteraction } = useGameDesign()
    const [interactionDialogOpen, setInteractionDialogOpen] = useState(false)
    const [pickInteractionDialogOpen, setPickInteractionDialogOpen] = useState(false)
    const [interactionIndex, setInteractionIndex] = useState<number | undefined>(undefined)

    const handleInteractionButton = () => {
        if (gameDesign.interactions.some(criteria)) {
            setPickInteractionDialogOpen(true)
        } else {
            setInteractionIndex(undefined)
            setInteractionDialogOpen(true)
        }
    }

    const handlePickInteractionIndex = (index: number | undefined) => {
        setInteractionDialogOpen(true)
        setPickInteractionDialogOpen(false)
        setInteractionIndex(index)
    }

    return <>
        <Button onClick={handleInteractionButton}
            variant="outlined"
            disabled={disabled}
            startIcon={<InteractionIcon />}
        >interactions</Button>

        {(interactionDialogOpen) &&
            <InteractionDialog
                initialState={typeof interactionIndex === 'number' ? gameDesign.interactions[interactionIndex] : newPartial}
                cancelFunction={() => { setInteractionDialogOpen(false) }}
                confirm={(interaction) => {
                    setInteractionDialogOpen(false)
                    changeInteraction(interaction, interactionIndex)
                }}
            />
        }

        <PickInteractionDialog
            isOpen={pickInteractionDialogOpen}
            close={() => setPickInteractionDialogOpen(false)}
            pickIndex={handlePickInteractionIndex}
            criteria={criteria}
        />
    </>
}
