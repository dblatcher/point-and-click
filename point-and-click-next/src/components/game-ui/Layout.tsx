import { GameLayoutProps } from "../game/uiComponentSet";


export const Layout = ({
    children,
    verbMenu, itemMenu, commandLine, conversationMenu, saveMenu, soundToggle, endingScreen,
    isConversationRunning, isGameEnded, isSequenceRunning
}: GameLayoutProps) => {
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