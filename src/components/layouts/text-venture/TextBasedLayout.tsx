import { Box } from "@mui/material";
import { ContextualGameRoom, UiStateContext } from "point-click-components";
import { useContext, useEffect, useState } from "react";
import { SaveMenu } from "../basic/SaveMenu";
import { SoundToggle } from "../shared-mui-components/SoundToggle";
import { NarrativeFeed } from "./NarrativeFeed";
import { RoomDescription } from "./RoomDescription";
import { TextPrompt } from "./TextPrompt";


export const TextBasedLayout = () => {
    const { dispatchUi } = useContext(UiStateContext)
    const [initialResizeDone, setInitialResizeDone] = useState(false)

    useEffect(() => {
        if (initialResizeDone) { return }
        dispatchUi({ type: 'SET_SCREEN_SIZE', width: 300, height: 200 });
        setInitialResizeDone(true)
    }, [initialResizeDone, setInitialResizeDone, dispatchUi])

    return (<main>
        <SaveMenu />
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
                <ContextualGameRoom />
            </figure>
        </Box>
    </main>)
}