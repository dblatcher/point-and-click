import { findById } from "@/lib/util"
import { ContextualGameRoom, GameDataContext } from "point-click-components"
import { useContext } from "react"
import { StoryBoardPlayer } from "../storyboard/StoryBoardPlayer"
import { CommandLine } from "./CommandLine"
import { ConversationMenu } from "./ConversationMenu"
import { getUiCondition } from "./helpers"
import { ItemMenu } from "./ItemMenu"
import { RoomSizeButtons } from "./RoomSizeButton"
import { SaveMenu } from "./SaveMenu"
import { SoundToggle } from "./SoundToggle"
import { VerbMenu } from "./VerbMenu"
import { DebugLog } from "./RunnerDebugLog"


export const BasicLayout = () => {
    const { gameState, dispatch, gameDesign, allowLocalSaves } = useContext(GameDataContext)
    const { currentStoryBoardId } = gameState
    const storyBoard = findById(currentStoryBoardId, gameDesign.storyBoards)
    const condition = getUiCondition(gameState)

    // TO DO - how to control whether to remove DebugLog
    return <section>
        <DebugLog />
        <SoundToggle />
        <RoomSizeButtons />
        {allowLocalSaves && (
            <SaveMenu />
        )}
        {condition === 'story-board'
            ? (
                <div>
                    {storyBoard
                        ? <StoryBoardPlayer storyBoard={storyBoard} />
                        : <button onClick={() => dispatch({ type: 'CLEAR-STORYBOARD' })}>clear</button>
                    }
                </div>
            ) : (
                <div>
                    <ContextualGameRoom />

                    {condition === 'verbs' && (
                        <section>
                            <CommandLine />
                            <VerbMenu />
                            <ItemMenu />
                        </section>
                    )}
                    {condition === 'conversation' && (
                        <section>
                            <ConversationMenu />
                        </section>
                    )}
                </div>
            )}
    </section>
}