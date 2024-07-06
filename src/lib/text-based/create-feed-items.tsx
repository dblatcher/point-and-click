import { GameState } from "@/components/game";
import { describeCommand, findTarget } from "@/lib/commandFunctions";
import { CommandReport, ConsequenceReport, OrderReport } from "@/lib/game-event-emitter";
import { FeedItem } from "@/lib/text-based/types";
import { findById } from "@/lib/util";

export const stringToFeedItem = (message: string) => ({
    message
});
// TO DO - proper sentence grammar!
export const orderReportToFeedLine = (orderReport: OrderReport): FeedItem[] => {
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
export const commandReportToFeedLine = (commandReport: CommandReport): FeedItem => {
    const { command } = commandReport;
    return {
        message: describeCommand(command, true),
        type: 'command'
    };
};
export const consequenceReportToFeedLines = (consequenceReport: ConsequenceReport, state: GameState): string[] => {
    const { consequence, success, offscreen } = consequenceReport;
    if (!success || offscreen) {
        return [];
    }

    if (consequence.narrative) {
        return consequence.narrative;
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
            return consequence.takePlayer ? [`You enter ${consequence.roomId}.`] : [`Meanwhile, in ${consequence.roomId}...`];
        case "inventory": {
            const item = findById(consequence.itemId, state.items);
            const itemName = item?.name ?? consequence.itemId;
            if (consequence.addOrRemove === 'ADD') {
                return [`${getActorName()} now has the ${itemName}.`];
            } else {
                return [`${getActorName()} no longer has the ${itemName}.`];
            }
        }
        case "removeActor":
            return [`${getActorName()} has left.`];
        case "changeStatus":
            const target = findTarget(consequence, state, true);
            return [`${target?.name ?? consequence.targetId} is now ${consequence.status}.`];
        case "teleportActor": {
            const actor = findById(consequence.actorId, state.actors);
            if (!actor) {
                return [];
            }
            // issue! teleporting from within the same room is treated the same as teleporting from another room 
            const wasArrival = actor.room === state.currentRoomId;

            if (wasArrival) {
                return [`${getActorName()} just arrived in ${state.currentRoomId}.`];
            } else {
                return [`${getActorName()} just left ${state.currentRoomId}.`];
            }
        }
        case "toggleZone":
        // TO DO - how to describe a zone toggle?
        case "conversation":
        case "ending":
        case "soundEffect":
        case "flag":
        case "conversationChoice":
        case "sequence":
        case "order":
            return [];
    }
};
