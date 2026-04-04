import { Verb, ItemData, Command, ActorData, HotspotZone, GameData, getActorsPlayerCanSwitchTo } from "point-click-lib";
import { PromptFeedbackReport } from "@/lib/event-emitting/game-event-emitter";
import { makeRoomDescription } from "./create-feed-items";


const ignoreList = new Set<string>([])

const splitPhrase = (phrase: string) => phrase.split(" ").map(word => word.trim().toLowerCase())

const extractVerb = (words: string[], verbs: Verb[]) => {
    const verb = verbs
        .find(verb => splitPhrase(verb.label)
            .every((word, index) => word == words[index]))
    if (!verb) {
        return {
            verb: undefined,
            words
        }
    }
    const verbPhraseLength = splitPhrase(verb.label).length
    return {
        verb: verb,
        words: words.slice(verbPhraseLength)
    }
}

const extractItem = (words: string[], items: ItemData[]) => {
    const item = items
        .find(item => splitPhrase(item.name ?? item.id)
            .every((word, index) => word == words[index]))
    if (!item) {
        return {
            item: undefined,
            words
        }
    }
    const itemPhraseLength = splitPhrase(item.name ?? item.id).length
    return {
        item,
        words: words.slice(itemPhraseLength)
    }
}

const findTargetInRemainingWords = (
    words: string[],
    actors: ActorData[],
    inventory: ItemData[],
    hotspots: HotspotZone[]
): Command['target'] | undefined => {
    const combinedWords = words.join(" ")
    const matchingActor = actors.find(_ => combinedWords.includes((_.name ?? _.id).toLowerCase()))
    const matchingItem = inventory.find(_ => combinedWords.includes((_.name ?? _.id).toLowerCase()))
    const matchingHotspot = hotspots.find(_ => combinedWords.includes((_.name ?? _.id).toLowerCase()))

    // TO DO[text-based] - handle ambiguities - duplicate names
    return matchingActor || matchingItem || matchingHotspot
}

export const promptToCommand = (
    promptText: string,
    verbs: Verb[],
    inventory: ItemData[],
    gameState: GameData
): Command | undefined => {
    const words = splitPhrase(promptText).filter(word => !ignoreList.has(word))
    const { verb, words: wordsMinusVerb } = extractVerb(words, verbs)
    if (!verb) {
        return undefined
    }
    const { item, words: wordsMinusVerbAndMaybeItem } = extractItem(wordsMinusVerb, inventory)
    const actorsInRoom = gameState.actors.filter(actor => actor.room === gameState.currentRoomId)
    const currentRoom = gameState.rooms.find(room => room.id == gameState.currentRoomId)
    const roomHotpots = currentRoom?.hotspots ?? []
    const target = findTargetInRemainingWords(wordsMinusVerbAndMaybeItem, actorsInRoom, inventory, roomHotpots)

    if (target) {
        return {
            verb, target, item
        }
    }
    if (item) {
        return {
            verb, target: item
        }
    }
    return undefined
};

const getSwitchingList = (state: GameData) => {
    const player = state.actors.find(a => a.isPlayer);
    const actorCanSwitchTo = getActorsPlayerCanSwitchTo(state, false);
    const whoYouAre = player ? `You are currently ${player.name ?? player.id}. ` : ''
    if (actorCanSwitchTo.length === 0) {
        return {
            message: `${whoYouAre}There are no other characters you can switch to.`
        }
    } else {
        return {
            message: `${whoYouAre}To switch to another character, type "switch:{name of character}". You can switch to:`,
            list: actorCanSwitchTo.map(a => a.name ?? a.id)
        }
    }
}

export const promptToHelpFeedback = (
    promptText: string,
    verbs: Verb[],
    inventory: ItemData[],
    state: GameData,
    player: ActorData | undefined
): PromptFeedbackReport | undefined => {
    switch (promptText.trim().toUpperCase()) {
        case 'HELP':
            return {
                message: 'Game help',
                list: [
                    'For a list of available verbs, type "verbs" or "V".',
                    'For a list of what your character is carrying, type "inventory" or "I".',
                    'For the the description of your character\'s location, type "look" or "l".',
                    'To see the characters you can switcht to, type "switch".',
                    'When in a conversation, just type the number of the dialoge choice you want.'
                ],
                type: 'system',
            }
        case 'V':
        case 'VERBS':
            return {
                message: `Available verbs:`,
                type: 'system',
                list: verbs.map(verb => verb.label),
            }
        case 'I':
        case 'INVENTORY':
            if (inventory.length === 0) {
                return {
                    message: 'You are carrying nothing.'
                }
            }
            return {
                message: `You have:`,
                list: inventory.map(item => item.name ?? item.id),
            }
        case 'L':
        case 'LOOK':
            return { ...makeRoomDescription(state, player), type: undefined }
        case 'SWITCH': {
            return getSwitchingList(state)
        }
        default:
            return undefined
    }
};

export const promptToCharacterSwitch = (promptText: string, state: GameData): { actor?: ActorData, input: string } | undefined => {
    const actorCanSwitchTo = getActorsPlayerCanSwitchTo(state, false);
    if (!promptText.toUpperCase().startsWith('SWITCH:')) {
        return undefined
    }
    const input = promptText.substring(7).trim()
    const matchingActor = actorCanSwitchTo.find(a => (a.name ?? a.id).toUpperCase() === input.toUpperCase())

    console.log({ input, matchingActor })
    return { actor: matchingActor, input }
}