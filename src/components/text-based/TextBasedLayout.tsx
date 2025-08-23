import { SoundToggle } from "@/components/game-ui/SoundToggle";
import { useGameState } from "@/context/game-state-context";
import { screenSizeAction } from "@/lib/game-state-logic/game-state-reducer";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { SaveMenu } from "../game-ui/SaveMenu";
import { RoomWrapper } from "../game/RoomWrapper";
import { SaveMenuWrapper } from "../game/SaveMenuWrapper";
import { NarrativeFeed } from "./NarrativeFeed";
import { RoomDescription } from "./RoomDescription";
import { TextPrompt } from "./TextPrompt";


export const TextBasedLayout = () => {
    const { updateGameState } = useGameState()
    const [initialResizeDone, setInitialResizeDone] = useState(false)

    useEffect(() => {
        if (initialResizeDone) { return }
        updateGameState(screenSizeAction(300, 200));
        setInitialResizeDone(true)
    }, [initialResizeDone, setInitialResizeDone, updateGameState])

    return (<main>
        <SaveMenuWrapper SaveMenuComponent={SaveMenu} />
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

        <Box display={'flex'} component={'aside'}>
            <figure role='img'>
                <RoomWrapper noInteraction />
            </figure>
        </Box>
    </main>)
}