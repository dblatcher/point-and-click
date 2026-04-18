import { InteractionIcon } from '@/components/GameEditor/material-icons';
import { DraftInteraction, useGameDesign } from "@/context/game-design-context";
import { Button, ButtonProps } from "@mui/material";
import { Interaction } from "point-click-lib";
import React, { useState } from "react";
import { InteractionDialog } from "./InteractionEditor/InteractionDialog";
import { PickInteractionDialog } from "./InteractionEditor/PickInteractionDialog";

interface Props {
    newPartial: DraftInteraction
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
    const { gameDesign, changeOrAddInteraction, interactionIndex, openInEditor, tabOpen } = useGameDesign()
    const [interactionDialogOpen, setInteractionDialogOpen] = useState(false)
    const [pickInteractionDialogOpen, setPickInteractionDialogOpen] = useState(false)

    const handleInteractionButton = () => {
        if (gameDesign.interactions.some(criteria)) {
            setPickInteractionDialogOpen(true)
        } else {
            openInEditor(tabOpen, undefined, undefined)
            setInteractionDialogOpen(true)
        }
    }

    const handlePickInteractionIndex = (index: number | undefined) => {
        setInteractionDialogOpen(true)
        setPickInteractionDialogOpen(false)
        openInEditor(tabOpen, undefined, index)
    }

    return <>
        <Button onClick={handleInteractionButton}
            variant={variant}
            disabled={disabled}
            startIcon={<InteractionIcon />}
        >{label}</Button>

        {(interactionDialogOpen) &&
            <InteractionDialog
                customDraft={newPartial}
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
