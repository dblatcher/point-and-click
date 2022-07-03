import { Conversation, ConversationChoice } from "../../definitions/Conversation";
import { cloneData } from "../../lib/clone";
import { GameState } from ".";
import { Sequence } from "src/definitions/Sequence";

function findChoiceFromRefSet(
    choiceRefSet: (string | undefined)[],
    conversations: Conversation[],
    currentConversation: Conversation
): ConversationChoice | undefined {

    // eslint-disable-next-line prefer-const
    let [choiceRef, branchId, conversationId] = choiceRefSet;
    if (!choiceRef) {
        console.warn(`missing choiceRef for findChoiceFromRefSet in conversation ${currentConversation.id}`)
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
        console.warn(`invalid conversationId "${conversationId}" for findChoiceFromRefSet in conversation ${currentConversation.id}`)
        return
    }

    const branch = conversation.branches[branchId]
    if (!branch) {
        console.warn(`invalid branchId "${conversationId}/${branchId}" for findChoiceFromRefSet in conversation ${currentConversation.id}`)
        return
    }

    const choice = branch.choices.find(_ => _.ref === choiceRef)
    if (!choice) {
        console.warn(`invalid choiceRef "${conversationId}/${branchId}/${choiceRef}" for findChoiceFromRefSet in conversation ${currentConversation.id}`)
        return
    }
    return choice
}

function setChoicesDisabled(
    disable: boolean,
    choiceRefSets: (string | undefined)[][],
    conversations: Conversation[],
    currentConversation: Conversation
): Conversation[] {

    choiceRefSets.forEach((refSet): void => {
        const choice = findChoiceFromRefSet(refSet, conversations, currentConversation)
        if (choice) {
            choice.disabled = disable
        }
    })

    return conversations
}

export function handleConversationChoice(choice: ConversationChoice, sequences: Record<string, Sequence | undefined>): { (state: GameState): Partial<GameState> } {

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
            setChoicesDisabled(false, choice.enablesChoices, conversations, currentConversation)
        }
        if (choice.disablesChoices) {
            setChoicesDisabled(true, choice.disablesChoices, conversations, currentConversation)
        }
        if (choice.nextBranch && currentConversation?.branches[choice.nextBranch]) {
            currentConversation.currentBranch = choice.nextBranch
        }
        const originalSequence = sequences[choice.sequence]
        if (!originalSequence) {
            console.warn(`invalid sequenceId "${choice.sequence}" in conversation "${currentConversationId}"`)
        } else {
            const sequenceCopy = originalSequence ? cloneData(originalSequence) : []
            if (choice.end) {
                sequenceCopy.push({
                    immediateConsequences: [{ type: 'conversation', end: true, conversationId: currentConversationId }]
                })
            }
            state.sequenceRunning = sequenceCopy
        }

        return state
    }
}