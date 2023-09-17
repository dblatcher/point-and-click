import { useGameState, useGameStateDerivations } from "@/context/game-state-context";
import { GameLayoutProps } from "../game/uiComponentSet";
import { CommandLine } from "./CommandLine";
import { ConversationMenu } from "./ConversationMenu";
import { EndingWrapper } from "./EndingScreen";
import { ItemMenu } from "./ItemMenu";
import { SoundToggle } from "./SoundToggle";
import { VerbMenu } from "./VerbMenu";


export const Layout = ({
    children,
    selectVerb, selectConversation, selectItem, handleHover,
    setScreenSize,
    saveMenu,
}: GameLayoutProps) => {
    const { isConversationRunning, isSequenceRunning } = useGameStateDerivations()
    const { roomWidth, roomHeight } = useGameState()

    return (<main>
        {saveMenu}
        <button onClick={() => { setScreenSize(roomWidth + 10, roomHeight + 10) }}>+</button>
        <button onClick={() => { setScreenSize(roomWidth - 10, roomHeight - 10) }}>-</button>
        <SoundToggle />
        {children}
        <EndingWrapper />
        {isConversationRunning ? (
            <>
                {!isSequenceRunning && <ConversationMenu select={selectConversation} />}
            </>
        ) : (
            <>
                <CommandLine />
                <VerbMenu select={selectVerb} />
                <ItemMenu handleHover={handleHover} select={selectItem} />
            </>
        )}
    </main>)
}