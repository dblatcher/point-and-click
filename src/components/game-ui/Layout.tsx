import { useGameStateDerivations } from "../game/game-state-context";
import { GameLayoutProps } from "../game/uiComponentSet";


export const Layout = ({
    children,
    verbMenu, itemMenu, commandLine, conversationMenu, saveMenu, soundToggle, endingScreen,
}: GameLayoutProps) => {
    const { isConversationRunning, isGameEnded, isSequenceRunning } = useGameStateDerivations()

    return (<main>
        {saveMenu}
        {soundToggle}
        {children}
        {isGameEnded && endingScreen}
        {isConversationRunning ? (
            <>
                {!isSequenceRunning && conversationMenu}
            </>
        ) : (
            <>
                {commandLine}
                {verbMenu}
                {itemMenu}
            </>
        )}
    </main>)
}