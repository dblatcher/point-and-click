import { useGameStateDerivations } from "../game/game-state-context";
import { GameLayoutProps } from "../game/uiComponentSet";
import { CommandLine } from "./CommandLine";
import { SoundToggle } from "./SoundToggle";


export const Layout = ({
    children,
    verbMenu, itemMenu, conversationMenu, saveMenu, endingScreen,
}: GameLayoutProps) => {
    const { isConversationRunning, isGameEnded, isSequenceRunning } = useGameStateDerivations()

    return (<main>
        {saveMenu}
        <SoundToggle />
        {children}
        {isGameEnded && endingScreen}
        {isConversationRunning ? (
            <>
                {!isSequenceRunning && conversationMenu}
            </>
        ) : (
            <>
                <CommandLine />
                {verbMenu}
                {itemMenu}
            </>
        )}
    </main>)
}