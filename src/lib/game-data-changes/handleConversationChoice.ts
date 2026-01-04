import { cloneData } from "@/lib/clone";
import { findById } from "@/lib/util";
import { ChoiceRefSet, Conversation, ConversationChoice, GameData, GameRunnerProps, LogToDebug, Sequence } from "point-click-lib";


function findChoiceFromRefSet(
    choiceRefSet: ChoiceRefSet,
    conversations: Conversation[],
    currentConversation: Conversation
): ConversationChoice | undefined {

    // eslint-disable-next-line prefer-const
    let { choiceRef, branchId, conversationId } = choiceRefSet;
    if (!choiceRef) {
        console.warn(`missing choiceRef for findChoiceFromRefSet in conversation ${currentConversation.id}`)
        return
    }
    if (!conversationId) {
        conversationId = currentConversation.id
    }
    if (!branchId) {
        branchId = currentConversation.currentBranch || currentConversation.defaultBranch
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
    choiceRefSets: ChoiceRefSet[],
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

function buildDefaultSequence(choice: ConversationChoice, defaultTalkTime: number, state: GameData): Sequence {

    const sequence: Sequence = { id: "", stages: [{ actorOrders: {} }] }
    const player = state.actors.find(_ => _.isPlayer)

    if (!player) {
        return sequence
    }

    const { actorOrders } = sequence.stages[0]
    if (actorOrders) {
        actorOrders[player.id] = [
            {
                type: 'say',
                text: choice.text,
                time: defaultTalkTime,
            }
        ]
    }

    return sequence
}

export const handleConversationChoice =
    ({ sequences, defaultTalkTime }: GameRunnerProps, debugLogger: LogToDebug) =>
        (state: GameData, choice: ConversationChoice): GameData => {
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

            const originalSequence = findById(choice.sequence, sequences) ?? choice.choiceSequence
            if (choice.sequence && !originalSequence) {
                debugLogger(`invalid sequenceId "${choice.sequence}" in conversation "${currentConversationId}"`)
            }

            const sequenceCopy: Sequence = originalSequence
                ? cloneData(originalSequence)
                : buildDefaultSequence(choice, defaultTalkTime, state);
            if (choice.end) {
                sequenceCopy.stages.push({
                    immediateConsequences: [{ type: 'conversation', end: true, conversationId: currentConversationId }]
                })
            }
            state.sequenceRunning = sequenceCopy


            return state
        }
