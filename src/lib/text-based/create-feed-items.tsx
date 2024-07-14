import { GameState } from "@/components/game";
import { ActorData, Ending } from "@/definitions";
import { describeCommand, findTarget } from "@/lib/commandFunctions";
import { CommandReport, ConsequenceReport, ConversationBranchReport, InGameEvent, OrderReport, SequenceStageReport } from "@/lib/game-event-emitter";
import { FeedItem } from "@/lib/text-based/types";
import { findById } from "@/lib/util";
import { standard } from "./standard-text";

const stringToFeedItem = (message: string) => ({
    message
});

// TO DO - proper sentence grammar!
const orderReportToFeedLine = (orderReport: OrderReport): FeedItem[] => {
    const { actor, order } = orderReport;

    if (order.narrative) {
        return order.narrative.map(stringToFeedItem);
    }

    const actorName = actor.isPlayer ? 'you' : actor.name ?? actor.id;
    switch (order.type) {
        case "say":
            const verb = order.animation ?? 'says';
            return [stringToFeedItem(`${actorName} ${verb} "${order.text}"`)];
        case "goTo":
            return [stringToFeedItem(`${actorName} goes to ${order.targetId}.`)];
        case "act":
            return [stringToFeedItem(`${actorName} does ${order.steps.map(step => step.animation).join()}.`)];
        case "move": {
            const couldNotReach = order.steps.length === 0;
            if (couldNotReach) {
                return [stringToFeedItem(`${actorName} wanted to move but could not find a way to get there.`)];
            }
            return [stringToFeedItem(`${actorName} moves.`)];
        }
    }
};
const commandReportToFeedLine = (commandReport: CommandReport): FeedItem => {
    const { command } = commandReport;
    return {
        message: describeCommand(command, true),
        type: 'command'
    };
};
const conversationBranchReportToFeedLines = (commandReport: ConversationBranchReport): [FeedItem] => {
    const { branch } = commandReport;
    return [{
        message: standard.PLEASE_CHOOSE_DIALOG,
        list: branch.choices.filter(choice => !choice.disabled).map((choice) => choice.text),
        type: 'dialogue'
    }];
};
const consequenceReportToFeedLines = (consequenceReport: ConsequenceReport, state: GameState, endings: Ending[]): FeedItem[] => {
    const { consequence, success, offscreen } = consequenceReport;
    if (!success || offscreen) {
        return [];
    }

    if (consequence.narrative) {
        return consequence.narrative.map(stringToFeedItem);
    }

    const getActorName = () => {
        if (!('actorId' in consequence)) {
            return 'you';
        }
        const actor = findById(consequence.actorId, state.actors);
        return !actor ? 'you' : actor.isPlayer ? 'you' : actor.name ?? actor.id;
    };

    switch (consequence.type) {
        case "changeRoom":
            return [stringToFeedItem(
                consequence.takePlayer
                    ? `You enter ${consequence.roomId}.`
                    : `Meanwhile, in ${consequence.roomId}...`
            )];
        case "inventory": {
            const item = findById(consequence.itemId, state.items);
            const itemName = item?.name ?? consequence.itemId;
            if (consequence.addOrRemove === 'ADD') {
                return [stringToFeedItem(`${getActorName()} now has the ${itemName}.`)];
            } else {
                return [stringToFeedItem(`${getActorName()} no longer has the ${itemName}.`)];
            }
        }
        case "removeActor":
            return [stringToFeedItem(`${getActorName()} has left.`)];
        case "changeStatus":
            const target = findTarget(consequence, state, true);
            return [stringToFeedItem(`${target?.name ?? consequence.targetId} is now ${consequence.status}.`)];
        case "teleportActor": {
            const actor = findById(consequence.actorId, state.actors);
            if (!actor) {
                return [];
            }
            // issue! teleporting from within the same room is treated the same as teleporting from another room 
            const text = actor.room === state.currentRoomId
                ? `${getActorName()} just arrived in ${state.currentRoomId}.`
                : `${getActorName()} just left ${state.currentRoomId}.`
            return [stringToFeedItem(text)];
        }
        case "conversation":
            if (consequence.end) {
                return [{ message: standard.CONVERSATION_END, type: 'system' }]
            }
            return [{ message: standard.CONVERSATION_START, type: 'system' }]
        case "ending": {
            const ending = findById(consequence.endingId, endings)

            return ending ? [
                { message: ending?.message },
                { message: `GAME OVER`, type: 'system' }
            ] : [{ message: `GAME OVER`, type: 'system' }]
        }
        case "toggleZone":
        // TO DO - how to describe a zone toggle?
        case "soundEffect":
        case "flag":
        case "conversationChoice":
        case "sequence":
        case "order":
            return [];
    }
};
const sequenceStageReportToFeedLines = (sequenceStageReport: SequenceStageReport, state: GameState): FeedItem[] => {
    const { stage } = sequenceStageReport;
    if (stage.narrative) {
        return stage.narrative.map(stringToFeedItem);
    }
    return []
};

export const inGameEventToFeedLines = (inGameEvent: InGameEvent, state: GameState, endings: Ending[]): FeedItem[] => {
    switch (inGameEvent.type) {
        case "command":
            return [commandReportToFeedLine(inGameEvent)]
        case "order":
            return orderReportToFeedLine(inGameEvent)
        case "consequence":
            return consequenceReportToFeedLines(inGameEvent, state, endings)
        case "conversation-branch":
            return conversationBranchReportToFeedLines(inGameEvent)
        case "sequence-stage":
            return sequenceStageReportToFeedLines(inGameEvent, state)
    }
}

export const makeRoomDescription = (state: GameState, player?: ActorData): FeedItem => {
    const { currentRoomId, rooms, actors } = state
    const room = rooms.find(room => room.id === currentRoomId)
    const hotspots = room?.hotspots ?? []
    const actorsInRoom = actors.filter(actor =>
        actor.room === currentRoomId &&
        actor.id !== player?.id
    )

    if (!room) {
        return {
            message: 'ERROR - no room',
            type: 'system'
        }
    }

    const message = `You ${player ? `(${player.name})` : ''} are in ${room.name ?? room.id}`

    const hotspotMessages = hotspots.map(hotspot =>
        `There is a ${hotspot.name ?? hotspot.id} here.`
    )

    const actorMessages = actorsInRoom.map(actor =>
        `${actor.name ?? actor.id} is here. ${actor.status ? `It is ${actor.status}.` : ''}`
    )

    return {
        message,
        list: [...hotspotMessages, ...actorMessages]
    }
}
