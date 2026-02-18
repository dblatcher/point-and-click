import { findById } from "@/lib/util"
import { ContextualGameRoom, GameDataContext } from "point-click-components"
import { useContext } from "react"
import { StoryBoardPlayer } from "../storyboard/StoryBoardPlayer"
import { CommandLine } from "./CommandLine"
import { ItemMenu } from "./ItemMenu"
import { VerbMenu } from "./VerbMenu"
import { getUiCondition } from "./helpers"
import { ConversationMenu } from "./ConversationMenu"


export const BasicLayout = () => {
    const { gameState, dispatch, gameDesign } = useContext(GameDataContext)
    const { currentStoryBoardId } = gameState
    const storyBoard = findById(currentStoryBoardId, gameDesign.storyBoards)

    const condition = getUiCondition(gameState)

    return <section>
        <p>game runner!</p>
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