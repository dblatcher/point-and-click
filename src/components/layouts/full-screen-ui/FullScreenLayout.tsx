import { StoryBoardPlayer } from "@/components/storyboard/StoryBoardPlayer";
import { Box } from "@mui/material";
import { ConversationChoices } from "point-click-components";
import { FullScreenWrapper } from "../../FullScreenWrapper";
import { DialogSaveMenu } from "../shared-mui-components/DialogSaveMenu";
import { useGameStateDerivations } from "../use-derivations";
import { RoomWrapperWithOverlay } from "./RoomWrapperWithOverlay";
import { SoundToggle } from "../shared-mui-components/SoundToggle";


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
                        <SoundToggle buttonType='IconButton' />
                        <DialogSaveMenu />
                    </div>
                    <RoomWrapperWithOverlay />
                    {!isSequenceRunning && (
                        <Box sx={{
                            position: 'absolute',
                            bottom: 0,
                            'section': {
                                paddingLeft: 1,
                                'button': {
                                    backgroundColor: 'white',
                                    width: '100%'
                                }
                            }
                        }}>
                            {isConversationRunning ? <ConversationChoices /> : <></>}
                        </Box>
                    )}
                </main>
            }
        </FullScreenWrapper>
    )
}