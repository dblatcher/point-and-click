import { useGameStateDerivations } from "../game/game-state-context";
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

    saveMenu,
}: GameLayoutProps) => {
    const { isConversationRunning, isSequenceRunning } = useGameStateDerivations()

    return (<main>
        {saveMenu}
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