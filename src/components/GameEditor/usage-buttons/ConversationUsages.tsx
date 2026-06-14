import { useGameDesign } from "@/context/game-design-context";
import { findConversationsUsingConversation, findInteractionsUsingConversation, findSequencesUsingConversation } from '@/lib/find-uses';
import { ButtonProps } from "@mui/material";
import { Conversation } from "point-click-lib";
import React from "react";
import { UsageButton } from "./UsageButton";

interface Props {
    item: Conversation
    disabled?: boolean;
    variant?: ButtonProps['variant'];
}


export const ConversationUsages: React.FunctionComponent<Props> = ({
    item,
    disabled,
    variant = 'outlined'
}) => {
    const { gameDesign } = useGameDesign()
    const interactionsUsing = findInteractionsUsingConversation(item.id, gameDesign)
    const sequencesUsing = findSequencesUsingConversation(item.id, gameDesign)
    const conversationsUsing = findConversationsUsingConversation(item.id, gameDesign)

    return (
        <UsageButton
            disabled={disabled}
            variant={variant}
            interactionsUsing={interactionsUsing}
            sequencesUsing={sequencesUsing} 
            conversationsUsing={conversationsUsing}
        />
    )
}
