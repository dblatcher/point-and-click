import { ConversationChoice } from "../../definitions/Conversation";
import { cloneData } from "../../lib/clone";
import { GameState } from ".";

export function handleConversationChoice(choice: ConversationChoice): { (state: GameState): Partial<GameState> } {

    return (state): GameState => {

        const { conversations, currentConversationId = '' } = state;
        const currentConversation = conversations.find(conversation => conversation.id === currentConversationId)
        if (!currentConversation) {
            return state
        }
        if (choice.once) {
            choice.disabled = true
        }
        if (choice.nextBranch && currentConversation?.branches[choice.nextBranch]) {
            currentConversation.currentBranch = choice.nextBranch
        }
        const sequenceCopy = cloneData(choice.sequence)
        if (choice.end) {
            sequenceCopy.push({
                immediateConsequences: [{ type: 'conversation', end: true, conversationId: currentConversationId }]
            })
        }
        state.sequenceRunning = sequenceCopy

        return state
    }
}