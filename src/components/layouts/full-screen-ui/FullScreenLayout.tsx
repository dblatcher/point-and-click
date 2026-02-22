import { useGameStateDerivations } from "../use-derivations";
import { FullScreenWrapper } from "../../FullScreenWrapper";
import { DialogSaveMenu } from "../shared-mui-components/DialogSaveMenu";
import { ConversationMenu } from "../basic/ConversationMenu";
import { RoomWrapperWithOverlay } from "./RoomWrapperWithOverlay";
import { StoryBoardPlayer } from "@/components/storyboard/StoryBoardPlayer";

export const FullScreenLayout = () => {
    const { isConversationRunning, isSequenceRunning, currentStoryBoard } = useGameStateDerivations()

    return (
        <FullScreenWrapper>
            {currentStoryBoard
                ? <main
                    style={{
                        position: 'fixed',
                        inset: 0,
                    }}
                >
                    <StoryBoardPlayer storyBoard={currentStoryBoard} />
                </main>
                : <main style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        right: 0
                    }}>
                        <DialogSaveMenu />
                    </div>
                    <RoomWrapperWithOverlay />
                    {!isSequenceRunning && (
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                        }}>
                            {isConversationRunning ? <ConversationMenu /> : <></>}
                        </div>
                    )}
                </main>
            }
        </FullScreenWrapper>
    )
}