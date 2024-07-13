import { useGameState } from "@/context/game-state-context";
import { InGameEvent, PromptFeedbackReport } from "@/lib/game-event-emitter";
import { commandReportToFeedLine, consequenceReportToFeedLines, conversationBranchReportToFeedLines, orderReportToFeedLine } from "@/lib/text-based/create-feed-items";
import { FeedItem } from "@/lib/text-based/types";
import { useEffect, useRef, useState } from "react";
import { ScrollingFeed } from "../ScrollingFeed";
import { FeedLine } from "./FeedLine";
import { useGameInfo } from "@/context/game-info-provider";

export const NarrativeFeed = () => {
    const state = useGameState();
    const {endings} = useGameInfo()
    const { emitter } = state
    const [feed, setFeed] = useState<FeedItem[]>([])
    const feedRef = useRef<FeedItem[]>([])

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
                    feedRef.current.push(...consequenceReportToFeedLines(inGameEvent, state, endings))
                    break
                case "conversation-branch":
                    feedRef.current.push(...conversationBranchReportToFeedLines(inGameEvent))
                    break
            }
            setFeed(feedRef.current)
        }

        const handlePromptFeedback = (feedback: PromptFeedbackReport) => {
            feedRef.current.push({
                message: feedback.message,
                type: feedback.type,
                list: feedback.list,
            })
            setFeed(feedRef.current)
        }

        emitter.on('in-game-event', handleInGameEvent)
        emitter.on('prompt-feedback', handlePromptFeedback)
        return () => {
            emitter.off('in-game-event', handleInGameEvent)
            emitter.off('prompt-feedback', handlePromptFeedback)
        }
    })


    return <ScrollingFeed
        feed={feed.map((feedItem, index) =>
            <FeedLine key={index} feedItem={feedItem} />
        )}
        maxHeight={250}
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
