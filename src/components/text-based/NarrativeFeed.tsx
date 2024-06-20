import { useGameState } from "@/context/game-state-context";
import { describeCommand, findTarget } from "@/lib/commandFunctions";
import { CommandReport, ConsequenceReport, InGameEvent, OrderReport } from "@/lib/game-event-emitter";
import { findById } from "@/lib/util";
import { Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ScrollingFeed } from "../ScrollingFeed";
import { GameState } from "../game";



// TO DO - proper sentence grammar!
// TO DO = optional custom text descriptions of orders!
const orderReportToFeedLine = (orderReport: OrderReport): string[] => {
    const { actor, order } = orderReport;

    if (order.narrative) {
        return order.narrative
    }

    const actorName = actor.isPlayer ? 'you' : actor.name ?? actor.id;
    switch (order.type) {
        case "say":
            const verb = order.animation ?? 'says'
            return [`${actorName} ${verb} "${order.text}"`]
        case "goTo":
            return [`${actorName} goes to ${order.targetId}.`]
        case "act":
            return [`${actorName} does ${order.steps.map(step => step.animation).join()}.`]
        case "move": {
            const couldNotReach = order.steps.length === 0
            if (couldNotReach) {
                return [`${actorName} wanted to move but could not find a way to get there.`]
            }
            return [`${actorName} moves.`]
        }
    }
}

const commandReportToFeedLine = (commandReport: CommandReport): string => {
    const { command } = commandReport
    return ` > ${describeCommand(command, true)}`
}

const consequenceReportToFeedLines = (consequenceReport: ConsequenceReport, state: GameState): string[] => {
    const { consequence, success, offscreen } = consequenceReport
    if (!success || offscreen) {
        return []
    }

    if (consequence.narrative) {
        return consequence.narrative
    }

    const getActorName = () => {
        if (!('actorId' in consequence)) {
            return 'you'
        }
        const actor = findById(consequence.actorId, state.actors)
        return !actor ? 'you' : actor.isPlayer ? 'you' : actor.name ?? actor.id
    }

    switch (consequence.type) {
        case "changeRoom":
            return consequence.takePlayer ? [`You enter ${consequence.roomId}.`] : [`Meanwhile, in ${consequence.roomId}...`]
        case "inventory": {
            const item = findById(consequence.itemId, state.items)
            const itemName = item?.name ?? consequence.itemId
            if (consequence.addOrRemove === 'ADD') {
                return [`${getActorName()} now has the ${itemName}.`]
            } else {
                return [`${getActorName()} no longer has the ${itemName}.`]
            }
        }
        case "removeActor":
            return [`${getActorName()} has left.`]
        case "changeStatus":
            const target = findTarget(consequence, state, true)
            return [`${target?.name ?? consequence.targetId} is now ${consequence.status}.`]
        case "teleportActor": {
            const actor = findById(consequence.actorId, state.actors);
            if (!actor) {
                return []
            }
            // issue! teleporting from within the same room is treated the same as teleporting from another room 
            const wasArrival = actor.room === state.currentRoomId

            if (wasArrival) {
                return [`${getActorName()} just arrived in ${state.currentRoomId}.`]
            } else {
                return [`${getActorName()} just left ${state.currentRoomId}.`]
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
            return []
    }
}

export const NarrativeFeed = () => {
    const state = useGameState();
    const { emitter } = state
    const [feed, setFeed] = useState<string[]>([])
    const feedRef = useRef<string[]>([])

    useEffect(() => {
        const handleInGameEvent = (inGameEvent: InGameEvent) => {
            switch (inGameEvent.type) {
                case "command":
                    feedRef.current.push(commandReportToFeedLine(inGameEvent))
                    break
                case "order":
                    feedRef.current.push(...orderReportToFeedLine(inGameEvent))
                    break;
                case "consequence":
                    feedRef.current.push(...consequenceReportToFeedLines(inGameEvent, state))
                    break
            }
            setFeed(feedRef.current)
        }

        emitter.on('in-game-event', handleInGameEvent)
        return () => {
            emitter.off('in-game-event', handleInGameEvent)
        }
    })

    const formattedFeed = feed.map((text, index) => <Typography key={index}>{text}</Typography>)

    return <ScrollingFeed feed={formattedFeed} maxHeight={160}
        boxProps={{
            component: 'section',
            flex: 1,
            paddingX: 1,
            role: 'log',
            'aria-atomic': true,
            'aria-live': "assertive",
            'aria-label': 'in-game events'
        }}
        listProps={{
            sx: {
                listStyle: 'none',
                padding: 0
            }
        }}
    />
};
