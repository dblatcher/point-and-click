import { Order } from "@/definitions";
import { useEffect, useRef, useState } from "react";
import { useGameState } from "@/context/game-state-context";
import { CommandReport, OrderReport } from "@/lib/game-event-emitter";
import { describeCommand } from "@/lib/commandFunctions";


// TO DO - provide the actor name and name of go to target
const orderReportToFeedLine = (orderReport: OrderReport): string => {
    const { actorId, order } = orderReport
    switch (order.type) {
        case "say":
            const verb = order.animation ?? 'says'
            return `${actorId} ${verb} "${order.text}"`
        case "goTo":
            return `${actorId} goes to ${order.targetId}.`
        case "act":
            return `${actorId} does ${order.steps.map(step => step.animation).join()}.`
        case "move": {
            const couldNotReach = order.steps.length === 0
            if (couldNotReach) {
                return `${actorId} wanted to move could not find a way to get there.`
            }
            return `${actorId} moves.`
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
