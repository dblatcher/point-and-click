import { useGameStateDerivations } from "@/context/game-state-context";
import { DialogSaveMenu } from "../game-mui-ux/DialogSaveMenu";
import { ConversationMenu } from "../game-ui/ConversationMenu";
import { SaveMenuWrapper } from "../game/SaveMenuWrapper";
import { RoomWrapperWithOverlay } from "./RoomWrapperWithOverlay";
import { FullScreenWrapper } from "../FullScreenWrapper";

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
                    <SaveMenuWrapper SaveMenuComponent={DialogSaveMenu} />
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