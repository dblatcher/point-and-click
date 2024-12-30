import { useGameState, useGameStateDerivations } from "@/context/game-state-context";
import { screenSizeAction } from "@/lib/game-state-logic/game-state-reducer";
import { ConversationMenu } from "../game-ui/ConversationMenu";
import { EndingWrapper } from "../game-ui/EndingScreen";
import { SaveMenu } from "../game-ui/SaveMenu";
import { SoundToggle } from "../game-ui/SoundToggle";
import { SaveMenuWrapper } from "../game/SaveMenuWrapper";
import { RoomWrapperWithOverlay } from "./RoomWrapperWithOverlay";


export const FullScreenLayout = () => {
    const { updateGameState } = useGameState()
    const { isConversationRunning, isSequenceRunning } = useGameStateDerivations()
    const { roomWidth, roomHeight } = useGameState().gameState

    return (<main>
        <SaveMenuWrapper SaveMenuComponent={SaveMenu} />
        <button onClick={() => updateGameState(screenSizeAction(roomWidth + 10, roomHeight + 10))}>+</button>
        <button onClick={() => updateGameState(screenSizeAction(roomWidth - 10, roomHeight - 10))}>-</button>
        <SoundToggle />
        <RoomWrapperWithOverlay />
        <EndingWrapper />
        {isConversationRunning && (
            <div style={{
                position: 'absolute',
                bottom: 0,
            }}>
                {!isSequenceRunning && <ConversationMenu />}
            </div>
        )}
    </main>)
}