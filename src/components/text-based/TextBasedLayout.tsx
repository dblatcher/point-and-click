import { CommandLine } from "@/components/game-ui/CommandLine";
import { ConversationMenu } from "@/components/game-ui/ConversationMenu";
import { EndingWrapper } from "@/components/game-ui/EndingScreen";
import { ItemMenu } from "@/components/game-ui/ItemMenu";
import { SoundToggle } from "@/components/game-ui/SoundToggle";
import { VerbMenu } from "@/components/game-ui/VerbMenu";
import { useGameState, useGameStateDerivations } from "@/context/game-state-context";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { GameLayoutProps } from "../game/uiComponentSet";
import { NarrativeFeed } from "./NarrativeFeed";
import { RoomDescription } from "./RoomDescription";
import { TextPrompt } from "./TextPrompt";
import { screenSizeAction } from "@/lib/game-state-logic/game-state-reducer";


export const TextBasedLayout = ({
    children,
    selectItem, handleHover,
    saveMenu,
}: GameLayoutProps) => {
    const { updateGameState } = useGameState()
    const [initialResizeDone, setInitialResizeDone] = useState(false)
    const { isConversationRunning, isSequenceRunning } = useGameStateDerivations()

    useEffect(() => {
        if (initialResizeDone) { return }
        updateGameState(screenSizeAction(300, 200));
        setInitialResizeDone(true)
    }, [initialResizeDone, setInitialResizeDone, updateGameState])

    return (<main>
        {saveMenu}
        <SoundToggle />

        <Box display={'flex'} minHeight={300} padding={1}>
            <Box display={'flex'} justifyContent={'space-between'} flex={1}>
                <RoomDescription />
            </Box>
            <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'} flex={2}>
                <NarrativeFeed />
                <TextPrompt />
            </Box>
        </Box>

        <EndingWrapper />

        <Box display={'flex'}>
            <figure role='img'>
                {children}
            </figure>
            {isConversationRunning ? (
                <div>
                    {!isSequenceRunning && <ConversationMenu />}
                </div>
            ) : (
                <div>
                    <CommandLine />
                    <VerbMenu />
                    <ItemMenu handleHover={handleHover} select={selectItem} />
                </div>
            )}
        </Box>
    </main>)
}