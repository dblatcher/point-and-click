import { InteractionIcon } from '@/components/GameEditor/material-icons';
import { useGameDesign } from "@/context/game-design-context";
import { Badge, Button, ButtonProps } from "@mui/material";
import { Interaction } from "point-click-lib";
import React, { useState } from "react";
import { PickInteractionDialog } from "./InteractionEditor/PickInteractionDialog";
import { makeBlankInteraction } from './defaults';

interface Props {
    template: Interaction
    criteria: { (interaction: Interaction): boolean }
    disabled?: boolean;
    label?: string;
    variant?: ButtonProps['variant'];
}

export const InteractionsDialogsButton: React.FunctionComponent<Props> = ({
    template,
    criteria,
    disabled,
    label = 'interactions',
    variant = 'outlined'
}) => {
    const { gameDesign, dispatchDesignUpdate } = useGameDesign()
    const [pickInteractionDialogOpen, setPickInteractionDialogOpen] = useState(false)
    const count = gameDesign.interactions.filter(criteria).length;

    const createAndOpenNew = () => {
        dispatchDesignUpdate({ type: 'add-new-interaction', data: makeBlankInteraction(template) })
        dispatchDesignUpdate({ type: 'set-interaction-index', interactionIndex: gameDesign.interactions.length })
    }

    const handlePickInteractionIndex = (interactionIndex: number) => {
        setPickInteractionDialogOpen(false)
        dispatchDesignUpdate({ type: 'set-interaction-index', interactionIndex })
    }

    const handleInteractionButton = () => {
        if (gameDesign.interactions.some(criteria)) {
            setPickInteractionDialogOpen(true)
        } else {
            createAndOpenNew()
        }
    }


    return <>
        <Badge badgeContent={count} color='secondary'>
            <Button onClick={handleInteractionButton}
                variant={variant}
                disabled={disabled}
                startIcon={<InteractionIcon />}
            >{label}</Button>
        </Badge>

        <PickInteractionDialog
            isOpen={pickInteractionDialogOpen}
            close={() => setPickInteractionDialogOpen(false)}
            pickIndex={handlePickInteractionIndex}
            createAndOpenNew={createAndOpenNew}
            criteria={criteria}
        />
    </>
}
