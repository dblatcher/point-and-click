import { useGameState } from "@/context/game-state-context";
import { describeCommand } from "@/lib/commandFunctions";
import { CommandReport, OrderReport } from "@/lib/game-event-emitter";
import { useEffect, useRef, useState } from "react";



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


    // to do - add the scrolling css for this or find a nice MUI alternative
    const listRef = useRef<HTMLUListElement>(null)
    useEffect(() => {
        const { current: listElement } = listRef
        if (!listElement) { return }
        listElement.scrollTo({ left: 0, top: listElement.scrollHeight })
    }, [feed.length])

    return (
        <aside>
            <div style={{ flex: 1 }}>
                <ul>
                    {feed.map((entry, index) => (
                        <li key={index}>
                            {entry}
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};
