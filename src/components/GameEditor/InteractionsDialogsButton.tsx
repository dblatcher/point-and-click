import React, { useState } from "react";
import { InteractionIcon } from '@/components/GameEditor/material-icons';
import { Button, ButtonProps } from "@mui/material";
import { InteractionDialog } from "./InteractionEditor/InteractionDialog";
import { useGameDesign } from "@/context/game-design-context";
import { Interaction } from "@/definitions";
import { PickInteractionDialog } from "./InteractionEditor/PickInteractionDialog";

interface Props {
    newPartial: Partial<Interaction>
    criteria: { (interaction: Interaction): boolean }
    disabled?: boolean;
    label?: string;
    variant?: ButtonProps['variant'];
}

export const InteractionsDialogsButton: React.FunctionComponent<Props> = ({
    newPartial,
    criteria,
    disabled,
    label = 'interactions',
    variant = 'outlined'
}) => {
    const { gameDesign, changeOrAddInteraction } = useGameDesign()
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
            variant={variant}
            disabled={disabled}
            startIcon={<InteractionIcon />}
        >{label}</Button>

        {(interactionDialogOpen) &&
            <InteractionDialog
                initialInteraction={typeof interactionIndex === 'number' ? gameDesign.interactions[interactionIndex] : newPartial}
                cancel={() => { setInteractionDialogOpen(false) }}
                confirm={(interaction) => {
                    setInteractionDialogOpen(false)
                    changeOrAddInteraction(interaction, interactionIndex)
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
