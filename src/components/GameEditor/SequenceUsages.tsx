import { InteractionIcon } from '@/components/GameEditor/material-icons';
import { useGameDesign } from "@/context/game-design-context";
import { findConversationsUsingSequence, findInteractionsUsingSequence } from '@/lib/find-uses';
import { Badge, Button, ButtonGroup, ButtonProps, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Sequence } from "point-click-lib";
import React, { useState } from "react";
import { EditorInteractionShortcut, EditorShortcut } from './EditorShortcut';
import { describeInteraction } from '@/lib/game-design-logic/util';

interface Props {
    item: Sequence
    disabled?: boolean;
    variant?: ButtonProps['variant'];
}

export const SequenceUsages: React.FunctionComponent<Props> = ({
    item,
    disabled,
    variant = 'outlined'
}) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const { gameDesign } = useGameDesign()

    const interactionsUsing = findInteractionsUsingSequence(item.id, gameDesign)
    const [firstInteraction] = interactionsUsing
    const conversationsUsing = findConversationsUsingSequence(item.id, gameDesign)
    const [firstConversation] = conversationsUsing;
    const allUsages = [...interactionsUsing, ...conversationsUsing]

    if (allUsages.length === 0) {
        return null
    }

    if (allUsages.length === 1) {
        if (firstInteraction) {
            return <EditorInteractionShortcut
                title={describeInteraction(firstInteraction.interaction)}
                label='usage'
                interactionIndex={firstInteraction.index}
            />
        }
        if (firstConversation) {
            return <EditorShortcut
                itemType='conversations'
                itemId={firstConversation.id}
            />
        }
        return null
    }


    return <>
        <Badge badgeContent={allUsages.length} color='secondary'>
            <Button onClick={() => setDialogOpen(true)}
                variant={variant}
                disabled={disabled}
            >usages</Button>
        </Badge>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <DialogTitle>Sequence usages</DialogTitle>
            <DialogContent>
                <ButtonGroup orientation='vertical'>
                    {interactionsUsing.map(({ interaction, index }) => (
                        <EditorInteractionShortcut key={index}
                            label={describeInteraction(interaction)}
                            interactionIndex={index} />
                    ))}

                    {conversationsUsing.map(conversation => (
                        <EditorShortcut key={conversation.id}
                            itemType='conversations'
                            itemId={conversation.id}
                        />
                    ))}
                </ButtonGroup>
            </DialogContent>
        </Dialog>

    </>
}
