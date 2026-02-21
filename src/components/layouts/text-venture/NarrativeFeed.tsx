import { useInterval } from "@/hooks/useInterval";
import { InGameEvent, PromptFeedbackReport } from "@/lib/game-event-emitter";
import { inGameEventToFeedLines, storyBoardReportToFeedLines } from "@/lib/text-based/create-feed-items";
import { FeedItem } from "@/lib/text-based/types";
import { findById } from "@/lib/util";
import { useContext, useEffect, useRef, useState } from "react";
import { ScrollingFeed } from "../../ScrollingFeed";
import { FeedLine } from "./FeedLine";
import { GameDataContext } from "point-click-components";
import { logService } from "../log-service";

const { emitter } = logService

export const NarrativeFeed = () => {
    const { gameState, gameDesign } = useContext(GameDataContext);
    const { currentStoryBoardId } = gameState
    const [feed, setFeed] = useState<FeedItem[]>([])
    const feedQueue = useRef<FeedItem[]>([])

    useInterval(() => {
        if (feedQueue.current.length > 0) {
            setFeed([...feed, ...feedQueue.current])
            feedQueue.current.splice(0, feedQueue.current.length)
        }
    }, 100)

    useEffect(() => {
        if (currentStoryBoardId) {
            const board = findById(currentStoryBoardId, gameDesign.storyBoards)
            const boardMessages: FeedItem[] =
                board
                    ? storyBoardReportToFeedLines(board)
                    :
                    [{ message: `Missing storyboard: ${currentStoryBoardId}`, type: 'system' }];
            feedQueue.current.push(...boardMessages, { message: '[press enter to continue]', type: 'system' },)
        }

    }, [currentStoryBoardId, gameDesign, feedQueue])

    useEffect(() => {
        const handleInGameEvent = (inGameEvent: InGameEvent) => {
            feedQueue.current.push(...inGameEventToFeedLines(inGameEvent, gameState))
        }

        const handlePromptFeedback = (feedback: PromptFeedbackReport) => {
            feedQueue.current.push({
                message: feedback.message,
                type: feedback.type,
                list: feedback.list,
            })
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
