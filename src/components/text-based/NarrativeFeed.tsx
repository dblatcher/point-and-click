import { useGameState } from "@/context/game-state-context";
import { describeCommand, findTarget } from "@/lib/commandFunctions";
import { CommandReport, ConsequenceReport, OrderReport } from "@/lib/game-event-emitter";
import { useEffect, useState } from "react";
import { ScrollingFeed } from "../ScrollingFeed";
import { Typography } from "@mui/material";
import { GameState } from "../game";
import { findById } from "@/lib/util";



// TO DO - provide the name of go to target
// TO DO - proper sentence grammar!
// TO DO = optional custom text descriptions of orders!
const orderReportToFeedLine = (orderReport: OrderReport): string => {
    const { actor, order } = orderReport;
    const actorName = actor.isPlayer ? 'you' : actor.name ?? actor.id;
    switch (order.type) {
        case "say":
            const verb = order.animation ?? 'says'
            return `${actorName} ${verb} "${order.text}"`
        case "goTo":
            return `${actorName} goes to ${order.targetId}.`
        case "act":
            return `${actorName} does ${order.steps.map(step => step.animation).join()}.`
        case "move": {
            const couldNotReach = order.steps.length === 0
            if (couldNotReach) {
                return `${actorName} wanted to move could not find a way to get there.`
            }
            return `${actorName} moves.`
        }
    }
}

const commandReportToFeedLine = (commandReport: CommandReport): string => {
    const { command } = commandReport
    return ` > ${describeCommand(command, true)}`
}

const consequenceReportToFeedLines = (consequenceReport: ConsequenceReport, state: GameState): string[] => {
    const { consequence, success } = consequenceReport
    if (!success) {
        return []
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
            // issue- will be reported even if the actor is removed from a non-current room (ie 'offscreen')
            // need an extra property on the report
            return [`${getActorName()} has left.`]
        case "changeStatus":
            const target = findTarget(consequence, state, true)
            return [`${target?.name ?? consequence.targetId} is now ${consequence.status}.`]
        case "teleportActor":
        case "toggleZone":
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

    useEffect(() => {
        const addOrderToFeed = (orderReport: OrderReport) => {
            setFeed([...feed, orderReportToFeedLine(orderReport)])
        }
        const addCommandToFeed = (commandReport: CommandReport) => {
            setFeed([...feed, commandReportToFeedLine(commandReport)])
        }
        const addConsequenecToFeed = (consequenceReport: ConsequenceReport) => {
            setFeed([...feed, ...consequenceReportToFeedLines(consequenceReport, state)])
        }
        emitter.on('order', addOrderToFeed)
        emitter.on('command', addCommandToFeed)
        emitter.on('consequence', addConsequenecToFeed)
        return () => {
            emitter.off('order', addOrderToFeed)
            emitter.off('command', addCommandToFeed)
            emitter.off('consequence', addConsequenecToFeed)
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
