import { findById } from "@/lib/util"
import { GameDataContext, UiStateContext } from "point-click-components"
import { useContext } from "react"

export const useGameStateDerivations = () => {
    const { gameState, gameDesign } = useContext(GameDataContext)
    const { uiState } = useContext(UiStateContext)
    const { verbId, itemId } = uiState
    const { currentStoryBoardId, currentConversationId, conversations, sequenceRunning, items, actors } = gameState

    const player = actors.find(actor => actor.isPlayer)
    const inventory = items.filter(item => item.actorId === player?.id)
    const currentConversation = findById(currentConversationId, conversations)
    const verb = findById(verbId, gameDesign.verbs);
    const lookVerb = gameDesign.verbs.find(verb => verb.isLookVerb) ?? gameDesign.verbs.find(verb => verb.id === 'LOOK');
    const moveVerb = gameDesign.verbs.find(verb => verb.isMoveVerb) ?? gameDesign.verbs.find(verb => verb.id === 'WALK');

    return {
        currentConversation,
        isConversationRunning: !!currentConversation,
        currentStoryBoard: findById(currentStoryBoardId, gameDesign.storyBoards),
        isSequenceRunning: !!sequenceRunning,
        currentItem: findById(itemId, items),
        player,
        inventory,
        verb,
        lookVerb,
        moveVerb,
    }
}