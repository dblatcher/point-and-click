import { useGameState, useGameStateDerivations } from "@/context/game-state-context";
import { GameLayoutProps } from "../game/uiComponentSet";
import { CommandLine } from "./CommandLine";
import { ConversationMenu } from "./ConversationMenu";
import { EndingWrapper } from "./EndingScreen";
import { ItemMenu } from "./ItemMenu";
import { SoundToggle } from "./SoundToggle";
import { VerbMenu } from "./VerbMenu";
import { screenSizeAction } from "@/lib/game-state-logic/game-state-reducer";
import { SaveMenuWrapper } from "../game/SaveMenuWrapper";
import { SaveMenu } from "./SaveMenu";


export const Layout = ({
    children,
}: GameLayoutProps) => {
    const { updateGameState } = useGameState()
    const { isConversationRunning, isSequenceRunning } = useGameStateDerivations()
    const { roomWidth, roomHeight } = useGameState().gameState

    return (<main>
        <SaveMenuWrapper SaveMenuComponent={SaveMenu}/>
        <button onClick={() => updateGameState(screenSizeAction(roomWidth + 10, roomHeight + 10))}>+</button>
        <button onClick={() => updateGameState(screenSizeAction(roomWidth - 10, roomHeight - 10))}>-</button>
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
                <ItemMenu />
            </>
        )}
    </main>)
}