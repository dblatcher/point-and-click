import { GameDataItem, GameDesign, Interaction, Sequence, Verb } from "@/definitions";
import { findIndexById } from "../util";
import { GameDataItemType } from "@/definitions/Game";

const addNewOrUpdate = <T extends GameDataItem>(newItem: T, list: T[]): T[] => {
    const matchIndex = findIndexById(newItem.id, list)
    if (matchIndex !== -1) {
        list.splice(matchIndex, 1, newItem)
    } else {
        list.push(newItem)
    }
    return list
}

export const addGameDataItem = (gameDesign: GameDesign, property: GameDataItemType, data: GameDataItem) => {
    addNewOrUpdate(data, gameDesign[property])
    return gameDesign
}

export const changeOrAddInteraction = (gameDesign: GameDesign, interaction: Interaction, index?: number) => {
    const { interactions } = gameDesign
    if (typeof index === 'undefined') {
        interactions.push(interaction)
    } else {
        interactions.splice(index, 1, interaction)
    }
    return gameDesign
}


const sequenceInvolvesFlag = (flagKey: string) => (sequence: Sequence) =>
    sequence.stages.some(stage =>
        stage.immediateConsequences?.some(consequence =>
            consequence.type === 'flag' && consequence.flag === flagKey
        )
    )

export const findFlagUsages = (gameDesign: GameDesign, flagKey: string) => {
    const interactionsWithFlag = gameDesign.interactions.filter(interaction =>
        interaction.flagsThatMustBeFalse?.includes(flagKey) ||
        interaction.flagsThatMustBeTrue?.includes(flagKey)
    )
    const sequencesWithFlag = gameDesign.sequences.filter(sequenceInvolvesFlag(flagKey))

    const conversationsWithFlag = gameDesign.conversations.filter(conversation =>
        Object.values(conversation.branches).some(branch =>
            branch?.choices.some(choice =>
                choice.choiceSequence && sequenceInvolvesFlag(flagKey)(choice.choiceSequence)
            )
        )
    )

    return { interactionsWithFlag, sequencesWithFlag, conversationsWithFlag }
}
