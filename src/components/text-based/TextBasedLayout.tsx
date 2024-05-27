import { CommandLine } from "@/components/game-ui/CommandLine";
import { ConversationMenu } from "@/components/game-ui/ConversationMenu";
import { EndingWrapper } from "@/components/game-ui/EndingScreen";
import { ItemMenu } from "@/components/game-ui/ItemMenu";
import { SoundToggle } from "@/components/game-ui/SoundToggle";
import { VerbMenu } from "@/components/game-ui/VerbMenu";
import { useGameStateDerivations } from "@/context/game-state-context";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { GameLayoutProps } from "../game/uiComponentSet";
import { RoomDescription } from "./RoomDescription";
import { DebugLog } from "../DebugLog";


export const TextBasedLayout = ({
    children,
    selectVerb, selectConversation, selectItem, handleHover,
    setScreenSize,
    saveMenu,
}: GameLayoutProps) => {
    const [initialResizeDone, setInitialResizeDone] = useState(false)
    const { isConversationRunning, isSequenceRunning } = useGameStateDerivations()

    useEffect(() => {
        if (initialResizeDone) { return }
        setScreenSize(300, 200);
        setInitialResizeDone(true)
    }, [initialResizeDone, setInitialResizeDone, setScreenSize])

    return (<main>
        {saveMenu}
        <SoundToggle />

<DebugLog />
        <Box display={'flex'}>
            <figure role='img'>
                {children}
            </figure>
            <div>
                <RoomDescription />
            </div>
        </Box>
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