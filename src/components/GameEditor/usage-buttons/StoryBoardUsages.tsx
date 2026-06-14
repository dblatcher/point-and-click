import { useGameDesign } from "@/context/game-design-context";
import { findConversationsUsingStoryBoard, findInteractionsUsingStoryboard, findSequencesUsingStoryBoard } from '@/lib/find-uses';
import { ButtonProps } from "@mui/material";
import { StoryBoard } from "point-click-lib";
import React from "react";
import { UsageButton } from "./UsageButton";

interface Props {
    item: StoryBoard
    disabled?: boolean;
    variant?: ButtonProps['variant'];
}

export const StoryBoardUsages: React.FunctionComponent<Props> = ({
    item,
    disabled,
    variant = 'outlined'
}) => {
    const { gameDesign } = useGameDesign()
    const interactionsUsing = findInteractionsUsingStoryboard(item.id, gameDesign)
    const conversationsUsing = findConversationsUsingStoryBoard(item.id, gameDesign)
    const sequencesUsing = findSequencesUsingStoryBoard(item.id, gameDesign)

    return <UsageButton
        disabled={disabled}
        variant={variant}
        interactionsUsing={interactionsUsing}
        conversationsUsing={conversationsUsing}
        sequencesUsing={sequencesUsing}
    />
}
