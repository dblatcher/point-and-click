import { Command, Interaction, RoomData, FlagMap, CommandTarget, GameContents } from "@/definitions";
import { findById } from "./util";
import { GameState } from "./game-state-logic/types";

export const wildCard = {
    ITEM: "$ITEM",
    TARGET: "$TARGET",
    VERB: "$VERB",
} as const

export const describeCommand = (command: Command, useNames = false): string => {
    const { verb, target, item } = command

    if (useNames) {
        if (item) {
            return `${verb.label}  ${item.name ?? item.id} ${verb.preposition ?? 'with'} ${target.name ?? target.id}`
        }
        return `${verb.label} ${target.name ?? target.id}`
    }

    if (item) {
        return `${verb.id}  ${item.id} ${verb.preposition} ${target.id}`
    }
    return `${verb.id} ${target.id}`
}

export function findTarget(ids: { targetId?: string, roomId?: string }, gameContents: GameContents, excludeItems = false): CommandTarget | undefined {
    const { targetId, roomId } = ids
    if (!targetId) { return undefined }
    const { rooms, actors, items } = gameContents
    const room = roomId ? findById(roomId, rooms) : undefined;
    const relevantRooms: RoomData[] = room ? [room] : roomId ? [] : rooms
    const hotspots = relevantRooms.flatMap(room => room.hotspots || [])


    return findById(targetId, excludeItems
        ? [...actors, ...hotspots]
        : [...actors, ...items, ...hotspots]
    )
}

export function getDefaultResponseText(command: Command, unreachable: boolean): string {
    const { verb, item, target } = command

    const { defaultResponseCannotReach, defaultResponseNoItem, defaultResponseWithItem } = verb
    const template = unreachable
        ? defaultResponseCannotReach
        : item
            ? defaultResponseWithItem
            : defaultResponseNoItem

    if (template) {
        let output = template;
        output = output.replace(wildCard.TARGET, target.name || target.id)
        output = output.replace(wildCard.ITEM, item?.name || item?.id || '')
        output = output.replace(wildCard.VERB, verb.label)
        return output
    }

    const genericText = unreachable
        ? `I can't reach the ${target.name || target.id}`
        : item
            ? `I can't ${verb.label} the ${item.name || item.id} ${verb.preposition} the ${target.name || target.id}`
            : `Nothing happens when I ${verb.label} the ${target.name || target.id}`;

    return genericText
}


function failsOnFlags(mustBe: boolean, idList: string[], flagMap: FlagMap): boolean {
    const results: (boolean | undefined)[] = idList.map(id => {
        const flag = flagMap[id]
        if (!flag) {
            console.warn(`Invalid flag id: "${id}"`)
            return undefined
        }
        return flag.value === mustBe
    })
    return results.includes(false)
}

function failsOnInventory(requiredInventory: string[], gameState: GameState): boolean {
    const player = gameState.actors.find(actor => actor.isPlayer)
    return gameState.items.some(item => item.actorId !== player?.id && requiredInventory.includes(item.id))
}

export function matchInteraction(
    command: Command,
    room: RoomData | undefined,
    interactions: Interaction[],
    gameState: GameState,
): Interaction | undefined {
    const { verb, item, target } = command
    const { flagMap } = gameState
    return interactions.find(interaction => {

        const matchesCommandAndTargetStatus = interaction.verbId === verb.id
            && interaction.targetId === target.id
            && (!interaction.roomId || interaction?.roomId === room?.id)
            && ((!interaction.itemId && !item) || (interaction?.itemId == item?.id))
            && ((!interaction.targetStatus) || (interaction.targetStatus == target.status))

        if (!matchesCommandAndTargetStatus) {
            return false
        }

        if (interaction.flagsThatMustBeTrue) {
            if (failsOnFlags(true, interaction.flagsThatMustBeTrue, flagMap)) {
                return false
            }
        }

        if (interaction.flagsThatMustBeFalse) {
            if (failsOnFlags(false, interaction.flagsThatMustBeFalse, flagMap)) {
                return false
            }
        }

        if (interaction.requiredInventory) {
            if (failsOnInventory(interaction.requiredInventory, gameState)) {
                return false
            }
        }

        return matchesCommandAndTargetStatus
    })
}
