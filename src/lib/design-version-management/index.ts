import { Consequence, Conversation, GameDesign, ImmediateConsequence, Sequence } from "@/definitions";
import { GameDesignSchema } from "@/definitions/Game";
import { V2GameDesign, v2GameDesignSchema } from "@/definitions/old-versions/v2";
import { V3GameDesign, v3GameDesignSchema } from "@/definitions/old-versions/v3";
import { DB_VERSION } from "../indexed-db";
import { PagePicture, StoryBoard } from "@/definitions/StoryBoard";
import { Ending } from "@/definitions/old-versions/Ending";

const upgradeV2toV3 = (v2Design: V2GameDesign): V3GameDesign => {
    return {
        ...v2Design,
        storyBoards: v2Design.storyBoards ?? [],
        schemaVersion: 3,
    }
}

const migrateV2Design = (v2Design: V2GameDesign): GameDesign => {
    return migrateV3Design(upgradeV2toV3(v2Design))
}


const convertEndingToStoryBoard = (ending: Ending, customId?: string): StoryBoard => {
    const picture: PagePicture | undefined = ending.imageId ? {
        x: 'center',
        y: 'center',
        width: ending.imageWidth ? ending.imageWidth / 16 : 20, // imageWidth was in pixels, PagePicture.width is in em
        height: ending.imageWidth ? ending.imageWidth / 16 : 20,
        image: {
            imageId: ending.imageId
        }
    } : undefined

    return {
        id: customId ?? ending.id,
        isEndOfGame: true,
        pages: [
            {
                title: ending.message,
                narrative: {
                    text: [],
                },
                color: '#FFFFFF',
                backgroundColor: '#000000',
                pictures: picture ? [picture] : []
            }
        ]
    }
}

const getIdWithUnusedSuffix = (base: string, existingIds: string[]): string => {
    const existingIdsWithBase = existingIds.filter(id => id.startsWith(base));
    const nextSuffix = (suffixNumber = 1): string => {
        const potentialId = `${base}_${suffixNumber}`
        return existingIdsWithBase.includes(potentialId) ? nextSuffix(suffixNumber + 1) : potentialId;
    }
    return nextSuffix()
}

const migrateV3Design = (v3Design: V3GameDesign): GameDesign => {


    const { storyBoards, interactions, sequences, conversations } = v3Design

    const storyBoardsIds = storyBoards.map(s => s.id);
    const idMap: Record<string, string> = {}

    const convertedEndings = v3Design.endings.map(ending => {
        const maybeSuffixedId = storyBoardsIds.includes(ending.id) ? getIdWithUnusedSuffix(ending.id, storyBoardsIds) : undefined;
        if (maybeSuffixedId) {
            storyBoardsIds.push(maybeSuffixedId)
        }
        idMap[ending.id] = maybeSuffixedId ?? ending.id;
        return convertEndingToStoryBoard(ending, maybeSuffixedId)
    })

    // TO DO - find all ending consequences in interactions, sequences and conversations
    // convert to storyboard consequences using id map

    const convertConsequenceIfEnding = (consequence: Consequence): Consequence => {
        if (consequence.type !== 'ending') {
            return consequence
        }
        const storyBoardId = idMap[consequence.endingId] ?? consequence.endingId;
        return {
            type: 'storyBoardConsequence',
            storyBoardId,
            narrative: consequence.narrative,
        }
    }
    const convertConsequencesInSequence = (sequence: Sequence): Sequence => ({
        ...sequence,
        stages: sequence.stages.map(stage => ({
            ...stage,
            immediateConsequences: stage.immediateConsequences?.map(convertConsequenceIfEnding) as ImmediateConsequence[]
        }))
    });

    const modifiedInteractions = interactions.map(interaction => {
        return { ...interaction, consequences: interaction.consequences.map(convertConsequenceIfEnding) }
    })

    const modifiedSequences = sequences.map(convertConsequencesInSequence)

    const modifiedConversations: Conversation[] = conversations.map(conversation => {
        const { branches } = conversation;
        for (let branchKey in branches) {
            const branch = branches[branchKey];
            if (!branch) { continue }
            branch.choices = branch.choices.map(choice => ({
                ...choice,
                choiceSequence: choice.choiceSequence ? convertConsequencesInSequence(choice.choiceSequence) : undefined
            }))
        }
        return {
            ...conversation,
            branches,
        }
    })

    return {
        ...v3Design,
        storyBoards: [...storyBoards, ...convertedEndings],
        interactions: modifiedInteractions,
        sequences: modifiedSequences,
        conversations: modifiedConversations,
        schemaVersion: DB_VERSION,
    }
}

type DesignParseResult = {
    success: true,
    gameDesign: GameDesign,
    sourceVersion: number,
    failureMessage?: undefined,
    updated?: boolean,
} | {
    success: false,
    gameDesign?: undefined,
    sourceVersion?: number,
    failureMessage?: string,
    updated?: boolean,
}

export const parseAndUpgrade = (maybeGameDesign: unknown): DesignParseResult => {

    const parseResult = GameDesignSchema.safeParse(maybeGameDesign);
    if (parseResult.success) {
        return ({
            success: true,
            gameDesign: parseResult.data,
            sourceVersion: DB_VERSION,
            updated: false,
        })
    }

    const v3ParseResult = v3GameDesignSchema.safeParse(maybeGameDesign);
    if (v3ParseResult.success) {
        return ({
            success: true,
            gameDesign: migrateV3Design(v3ParseResult.data),
            sourceVersion: 3,
            updated: true,
        })
    }

    const v2ParseResult = v2GameDesignSchema.safeParse(maybeGameDesign);
    if (v2ParseResult.success) {
        return ({
            success: true,
            gameDesign: migrateV2Design(v2ParseResult.data),
            sourceVersion: 2,
            updated: true,
        })
    }

    return {
        success: false,
        failureMessage: v2ParseResult.error.message
    }
}
