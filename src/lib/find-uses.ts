import { Consequence, Conversation, GameDesign, Sequence } from "point-click-lib";
import { cloneData } from "./clone";

const sequenceInvolvesFlag = (flagKey: string) => (sequence: Sequence) =>
    sequence.stages.some(stage =>
        stage.immediateConsequences?.some(consequence =>
            consequence.type === 'flag' && consequence.flag === flagKey
        )
    )

export const findFlagUsages = (gameDesign: GameDesign, flagKey: string) => {
    const interactionsWithFlagConditions = gameDesign.interactions.filter(interaction =>
        interaction.flagsThatMustBeFalse?.includes(flagKey) ||
        interaction.flagsThatMustBeTrue?.includes(flagKey)
    )

    const interactionsWithFlagConsequences = gameDesign.interactions.filter(interaction =>
        interaction.consequences.some(consequence => consequence.type === 'flag' && consequence.flag === flagKey)
    )

    const sequencesWithFlag = gameDesign.sequences.filter(sequenceInvolvesFlag(flagKey))

    const conversationsWithFlag = gameDesign.conversations.filter(conversation =>
        Object.values(conversation.branches).some(branch =>
            branch?.choices.some(choice =>
                choice.choiceSequence && sequenceInvolvesFlag(flagKey)(choice.choiceSequence)
            )
        )
    )

    return { interactionsWithFlagConditions, sequencesWithFlag, conversationsWithFlag, interactionsWithFlagConsequences }
}

export const getModificationToRemoveFlagAndReferences = (flagKey: string, gameDesign: GameDesign): Partial<GameDesign> => {

    const { flagMap, interactions, sequences, conversations } = cloneData(gameDesign);

    delete flagMap[flagKey];

    const notThisFlagKey = (reference: string) => reference !== flagKey
    const notConsequenceForThisFlag = (consequence: Consequence) => !(consequence.type === 'flag' && consequence.flag === flagKey);

    interactions.forEach(interaction => {
        interaction.flagsThatMustBeFalse = interaction.flagsThatMustBeFalse?.filter(notThisFlagKey);
        interaction.flagsThatMustBeTrue = interaction.flagsThatMustBeTrue?.filter(notThisFlagKey);
        interaction.consequences = interaction.consequences.filter(notConsequenceForThisFlag)
    })

    const removeFlagReferencesFromSequence = (sequence: Sequence) => {
        sequence.stages.forEach(stage => {
            stage.immediateConsequences = stage.immediateConsequences?.filter(notConsequenceForThisFlag)
        })
        return sequence
    }

    sequences.forEach(removeFlagReferencesFromSequence)

    conversations.forEach(conversation => {
        Object.values(conversation.branches).forEach(branch => {
            branch?.choices.forEach(choice => {
                choice.choiceSequence = choice.choiceSequence ? removeFlagReferencesFromSequence(choice.choiceSequence) : undefined
            })
        })
    })

    return { flagMap, interactions, sequences, conversations }
}


const consequenceUsesConversation = (conversationId: string) => (consequence: Consequence) =>
    consequence.type === 'conversation' && consequence.conversationId === conversationId
const consequenceUsesSequence = (sequenceId: string) => (consequence: Consequence) =>
    consequence.type === 'sequence' && consequence.sequence === sequenceId
const consequenceUsesStoryboard = (storyBoardId: string) => (consequence: Consequence) =>
    consequence.type === 'storyBoardConsequence' && consequence.storyBoardId === storyBoardId

const sequenceUsesConversation = (conversationId: string) => (sequence?: Sequence) => sequence?.stages.some(stage =>
    stage.immediateConsequences?.some(consequenceUsesConversation(conversationId))
)
const sequenceUsesStoryBoard = (storyBoardId: string) => (sequence?: Sequence) => sequence?.stages.some(stage =>
    stage.immediateConsequences?.some(consequenceUsesStoryboard(storyBoardId))
)

export const findInteractionsUsingSequence = (sequenceId: string, gameDesign: GameDesign) =>
    gameDesign.interactions.map((interaction, index) => ({ index, interaction })).filter(
        ({ interaction }) =>
            interaction.consequences.some(consequenceUsesSequence(sequenceId))
    )
export const findInteractionsUsingConversation = (conversationId: string, gameDesign: GameDesign) =>
    gameDesign.interactions.map((interaction, index) => ({ index, interaction })).filter(
        ({ interaction }) =>
            interaction.consequences.some(consequenceUsesConversation(conversationId))
    )
export const findInteractionsUsingStoryboard = (storyBoardId: string, gameDesign: GameDesign) =>
    gameDesign.interactions.map((interaction, index) => ({ index, interaction })).filter(
        ({ interaction }) =>
            interaction.consequences.some(consequenceUsesStoryboard(storyBoardId))
    )


export const findConversationsUsingSequence = (sequenceId: string, gameDesign: GameDesign): Conversation[] => {
    return gameDesign.conversations.filter(conversation =>
        Object.values(conversation.branches).some((branch) =>
            branch?.choices.some(choice =>
                choice.sequence === sequenceId)
        ))
}
export const findConversationsUsingConversation = (conversationId: string, gameDesign: GameDesign) =>
    gameDesign.conversations.filter(conversation =>
        Object.values(conversation.branches).some((branch) =>
            branch?.choices.some(choice =>
                sequenceUsesConversation(conversationId)(choice.choiceSequence)
            ))
    )
export const findConversationsUsingStoryBoard = (storyBoardId: string, gameDesign: GameDesign) =>
    gameDesign.conversations.filter(conversation =>
        Object.values(conversation.branches).some((branch) =>
            branch?.choices.some(choice =>
                sequenceUsesStoryBoard(storyBoardId)(choice.choiceSequence)
            ))
    )

export const findSequencesUsingConversation = (conversationId: string, gameDesign: GameDesign) =>
    gameDesign.sequences.filter(sequenceUsesConversation(conversationId))
export const findSequencesUsingStoryBoard = (storyBoardId: string, gameDesign: GameDesign) =>
    gameDesign.sequences.filter(sequenceUsesStoryBoard(storyBoardId))
