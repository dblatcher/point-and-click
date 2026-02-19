import { findById } from "@/lib/util"
import { CameraPointProvider, ContextualGameRoom, GameDataContext } from "point-click-components"
import { useContext } from "react"
import { StoryBoardPlayer } from "../storyboard/StoryBoardPlayer"
import { CommandLine } from "./CommandLine"
import { ItemMenu } from "./ItemMenu"
import { VerbMenu } from "./VerbMenu"
import { getUiCondition } from "./helpers"
import { ConversationMenu } from "./ConversationMenu"
import { useCamera } from "@/hooks/useCamera"
import { useInterval } from "@/hooks/useInterval"
import { getPointOfFocus } from "point-click-lib"
import { SaveMenu } from "./SaveMenu"


export const BasicLayout = () => {
    const { gameState, dispatch, gameDesign } = useContext(GameDataContext)
    const { currentStoryBoardId } = gameState
    const storyBoard = findById(currentStoryBoardId, gameDesign.storyBoards)

    const condition = getUiCondition(gameState)
    const { updateCamera, cameraPoint } = useCamera()

    // TO DO - should this be built into GameRunner?
    const moveCamera = () => {
        const { x, y } = getPointOfFocus(gameState) ?? { x: gameState.viewAngleX, y: gameState.viewAngleY }
        updateCamera(x, y, gameState.currentRoomId)
    }
    useInterval(moveCamera, 10)

    return <section>
        <CameraPointProvider value={{ cameraPoint }}>

            <p>game runner!</p>
            <SaveMenu />
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
        </CameraPointProvider>
    </section>
}