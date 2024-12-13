import { useGameState, useGameStateDerivations } from "@/context/game-state-context";
import { GameLayoutProps } from "../game/uiComponentSet";
import { CommandLine } from "./CommandLine";
import { ConversationMenu } from "./ConversationMenu";
import { EndingWrapper } from "./EndingScreen";
import { ItemMenu } from "./ItemMenu";
import { SoundToggle } from "./SoundToggle";
import { VerbMenu } from "./VerbMenu";
import { screenSizeAction } from "@/lib/game-state-logic/game-state-reducer";


export const Layout = ({
    children,
    selectItem, handleHover,
    saveMenu,
}: GameLayoutProps) => {
    const { dispatchGameStateAction } = useGameState()
    const { isConversationRunning, isSequenceRunning } = useGameStateDerivations()
    const { roomWidth, roomHeight } = useGameState().gameState

    return (<main>
        {saveMenu}
        <button onClick={() => dispatchGameStateAction(screenSizeAction(roomWidth + 10, roomHeight + 10))}>+</button>
        <button onClick={() => dispatchGameStateAction(screenSizeAction(roomWidth - 10, roomHeight - 10))}>-</button>
        <SoundToggle />
        {children}
        <EndingWrapper />
        {isConversationRunning ? (
            <>
                {!isSequenceRunning && <ConversationMenu />}
            </>
        ) : (
            <>
                <CommandLine />
                <VerbMenu />
                <ItemMenu handleHover={handleHover} select={selectItem} />
            </>
        )}
    </main>)
}