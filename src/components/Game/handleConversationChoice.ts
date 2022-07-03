import { Conversation, ConversationChoice } from "../../definitions/Conversation";
import { cloneData } from "../../lib/clone";
import { GameState } from ".";

function enableChoices(
    choiceRefSets: (string | undefined)[][],
    conversations: Conversation[],
    currentConversation: Conversation
): Conversation[] {

    choiceRefSets.forEach(([choiceRef, branchId, conversationId]): void => {
        if (!choiceRef) {
            console.warn(`missing choiceRef for enableChoices in conversation ${currentConversation.id}`)
            return
        }
        if (!conversationId) {
            conversationId = currentConversation.id
        }
        if (!branchId) {
            branchId = currentConversation.currentBranch || currentConversation.defaultBrach
        }

        const conversation = conversations.find(_ => _.id === conversationId);
        if (!conversation) {
            console.warn(`invalid conversationId "${conversationId}" for enableChoices in conversation ${currentConversation.id}`)
            return
        }

        const branch = conversation.branches[branchId]
        if (!branch) {
            console.warn(`invalid branchId "${conversationId}/${branchId}" for enableChoices in conversation ${currentConversation.id}`)
            return
        }

        const choice = branch.choices.find(_ => _.ref === choiceRef)
        if (!choice) {
            console.warn(`invalid choiceRef "${conversationId}/${branchId}/${choiceRef}" for enableChoices in conversation ${currentConversation.id}`)
            return
        }
        choice.disabled = false
    })

    return conversations
}

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
        if (choice.enablesChoices) {
            enableChoices(choice.enablesChoices, conversations, currentConversation)
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