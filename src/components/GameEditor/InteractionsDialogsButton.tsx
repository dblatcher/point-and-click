import { InteractionIcon } from '@/components/GameEditor/material-icons';
import { useGameDesign } from "@/context/game-design-context";
import { Button, ButtonProps } from "@mui/material";
import { Interaction } from "point-click-lib";
import React, { useState } from "react";
import { InteractionDialog } from "./InteractionEditor/InteractionDialog";
import { PickInteractionDialog } from "./InteractionEditor/PickInteractionDialog";
import { makeBlankInteraction } from './defaults';

type DraftInteraction = Interaction;

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
    const [pickInteractionDialogOpen, setPickInteractionDialogOpen] = useState(false)

    const handleInteractionButton = () => {
        if (gameDesign.interactions.some(criteria)) {
            setPickInteractionDialogOpen(true)
        } else {
            openInEditor(tabOpen, undefined, undefined) // TO DO - preserve item id
        }
    }

    const handlePickInteractionIndex = (index: number | undefined) => {
        setPickInteractionDialogOpen(false)
        changeOrAddInteraction(makeBlankInteraction(newPartial))
        openInEditor(tabOpen, undefined, index)
    }

    return <>
        <Button onClick={handleInteractionButton}
            variant={variant}
            disabled={disabled}
            startIcon={<InteractionIcon />}
        >{label}</Button>

        <PickInteractionDialog
            isOpen={pickInteractionDialogOpen}
            close={() => setPickInteractionDialogOpen(false)}
            pickIndex={handlePickInteractionIndex}
            criteria={criteria}
        />
    </>
}
