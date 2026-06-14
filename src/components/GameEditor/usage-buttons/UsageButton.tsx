import { describeInteraction } from '@/lib/game-design-logic/util';
import { Badge, Button, ButtonGroup, ButtonProps, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Conversation, Interaction, Sequence } from "point-click-lib";
import { ButtonForDialog } from '../../ButtonForDialog';
import { EditorInteractionShortcut, EditorShortcut } from '../EditorShortcut';

interface Props {
    disabled?: boolean;
    variant?: ButtonProps['variant'];
    interactionsUsing?: { interaction: Interaction, index: number }[],
    sequencesUsing?: Sequence[]
    conversationsUsing?: Conversation[]
}

export const UsageButton = ({
    disabled,
    variant,
    interactionsUsing = [],
    sequencesUsing = [],
    conversationsUsing= [],
}: Props) => {
    const [firstInteraction] = interactionsUsing
    const [firstSequence] = sequencesUsing;
    const [firstConversation] = conversationsUsing
    const allUsages = [...interactionsUsing, ...sequencesUsing, ...conversationsUsing]

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
        if (firstSequence) {
            return <EditorShortcut
                itemType='sequences'
                itemId={firstSequence.id}
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


    return (
        <Badge badgeContent={allUsages.length} color='secondary'>
            <ButtonForDialog buttonContent={'usages'}
                buttonProps={{ variant, disabled }}
            >
                {(close) => <>
                    <DialogTitle>Sequence usages</DialogTitle>
                    <DialogContent>
                        <ButtonGroup orientation='vertical'>
                            {interactionsUsing.map(({ interaction, index }) => (
                                <EditorInteractionShortcut key={index}
                                    label={describeInteraction(interaction)}
                                    interactionIndex={index} />
                            ))}
                            {sequencesUsing.map(sequence => (
                                <EditorShortcut key={sequence.id}
                                    itemType='sequences'
                                    itemId={sequence.id}
                                />
                            ))}
                            {conversationsUsing.map(conversation => (
                                <EditorShortcut key={conversation.id}
                                    itemType='conversations'
                                    itemId={conversation.id}
                                />
                            ))}
                        </ButtonGroup>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={close}>close</Button>
                    </DialogActions>
                </>}
            </ButtonForDialog>
        </Badge>
    )
}