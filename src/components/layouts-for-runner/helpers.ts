import { GameData } from "point-click-lib";

export const getUiCondition = (gameState: GameData) => {
    return gameState.currentStoryBoardId
        ? 'story-board'
        : gameState.sequenceRunning
            ? 'sequence'
            : gameState.currentConversationId
                ? 'conversation'
                : 'verbs';
}