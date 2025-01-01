import { useGameStateDerivations } from "@/context/game-state-context";
import { DialogSaveMenu } from "../game-mui-ux/DialogSaveMenu";
import { ConversationMenu } from "../game-ui/ConversationMenu";
import { EndingWrapper } from "../game-ui/EndingScreen";
import { SaveMenuWrapper } from "../game/SaveMenuWrapper";
import { RoomWrapperWithOverlay } from "./RoomWrapperWithOverlay";
import { InventoryDrawer } from "./InventoryDrawer";

export const FullScreenLayout = () => {
    const { isConversationRunning, isSequenceRunning } = useGameStateDerivations()

    return (<main style={{
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
        <EndingWrapper />
        {!isSequenceRunning && (
            <div style={{
                position: 'absolute',
                bottom: 0,
            }}>
                {isConversationRunning ? <ConversationMenu /> : <InventoryDrawer />}
            </div>
        )}
    </main>)
}