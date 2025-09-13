import { useGameStateDerivations } from "@/context/game-state-context";
import { FullScreenWrapper } from "../FullScreenWrapper";
import { DialogSaveMenu } from "../game-mui-ux/DialogSaveMenu";
import { ConversationMenu } from "../game-simple-ui/ConversationMenu";
import { RoomWrapperWithOverlay } from "./RoomWrapperWithOverlay";

export const FullScreenLayout = () => {
    const { isConversationRunning, isSequenceRunning } = useGameStateDerivations()

    return (
        <FullScreenWrapper>
            <main style={{
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
        </FullScreenWrapper>
    )
}