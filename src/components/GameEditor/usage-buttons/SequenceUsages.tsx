import { useGameDesign } from "@/context/game-design-context";
import { findConversationsUsingSequence, findInteractionsUsingSequence } from '@/lib/find-uses';
import { ButtonProps } from "@mui/material";
import { Sequence } from "point-click-lib";
import React from "react";
import { UsageButton } from "./UsageButton";

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
    const { gameDesign } = useGameDesign()
    const interactionsUsing = findInteractionsUsingSequence(item.id, gameDesign)
    const conversationsUsing = findConversationsUsingSequence(item.id, gameDesign)

    return <UsageButton
        disabled={disabled}
        variant={variant}
        interactionsUsing={interactionsUsing}
        conversationsUsing={conversationsUsing}
    />
}
