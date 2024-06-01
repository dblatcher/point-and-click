import { useGameState } from "@/context/game-state-context";
import { describeCommand } from "@/lib/commandFunctions";
import { CommandReport, OrderReport } from "@/lib/game-event-emitter";
import { useEffect, useState } from "react";
import { ScrollingFeed } from "../ScrollingFeed";
import { Typography } from "@mui/material";



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
        emitter.on('order', addOrderToFeed)
        emitter.on('command', addCommandToFeed)
        return () => {
            emitter.off('order', addOrderToFeed)
            emitter.off('command', addCommandToFeed)
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
