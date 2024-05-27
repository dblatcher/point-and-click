import { Order } from "@/definitions";
import { useEffect, useRef, useState } from "react";
import { useGameState } from "@/context/game-state-context";
import { OrderReport } from "@/lib/game-event-emitter";


const orderReportToFeedLine = (orderReport: OrderReport): string => {

    switch (orderReport.order.type) {
        case "say":
            return `${orderReport.actorId} says "${orderReport.order.text}"`
        case "goTo":
            return `${orderReport.actorId} goes to ${orderReport.order.targetId}.`
        case "move":
        case "act":

        default:
            return `${orderReport.actorId}: ${orderReport.order.type}`
    }
}

export const NarrativeFeed = () => {
    const state = useGameState();
    const { emitter } = state
    const [feed, setFeed] = useState<string[]>([])

    useEffect(() => {
        const addToFeed = (orderReport: { order: Order, actorId: string }) => {
            console.log(orderReport)
            setFeed([...feed, orderReportToFeedLine(orderReport)])
        }
        emitter.on('order', addToFeed)
        return () => {
            emitter.off('order', addToFeed)
        }
    })


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
