import { Box, Button, Container, Drawer, Stack, useTheme } from "@mui/material";
import { useState } from "react";
import { EndingWrapper } from "../game-ui/EndingScreen";
import { useGameStateDerivations } from "../game/game-state-context";
import { GameLayoutProps } from "../game/uiComponentSet";
import { CommandLine } from "./CommandLine";
import { ConversationMenu } from "./ConversationMenu";
import { ItemMenu } from "./ItemMenu";
import { SoundToggle } from "./SoundToggle";
import { VerbMenu } from "./VerbMenu";


export const BigLayout = ({
    children,
    selectVerb, selectConversation, selectItem, handleHover,
    saveMenu,
}: GameLayoutProps) => {
    const theme = useTheme()
    const { isConversationRunning, isSequenceRunning } = useGameStateDerivations()

    const [drawerOpen, setDrawerOpen] = useState(false)

    return (
        <>
            <CommandLine />
            <div style={{
                flex: '1',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {children}
            </div>


            {(!drawerOpen && !isConversationRunning) &&
                <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}>

                    <Button variant="contained" size="large" fullWidth
                        onClick={() => { setDrawerOpen(!drawerOpen) }}>OPEN</Button>
                </Box>
            }

            <Drawer open={isConversationRunning && !isSequenceRunning} anchor="bottom" variant="persistent" PaperProps={{ sx: { padding: 1 } }}>
                <Container maxWidth={'lg'}>
                    < ConversationMenu select={selectConversation} />
                </Container>
            </Drawer>

            <Drawer open={drawerOpen && !isConversationRunning} anchor="bottom" variant="persistent" PaperProps={{ sx: { padding: 1 } }}>
                <Container maxWidth={'md'}>
                    <Stack direction={'row'}>
                        <SoundToggle />
                        <Button variant="contained" onClick={() => { setDrawerOpen(!drawerOpen) }}>CLOSE</Button>
                    </Stack>
                    {isConversationRunning ? (
                        <>
                            {!isSequenceRunning && <ConversationMenu select={selectConversation} />}
                        </>
                    ) : (<>
                        <VerbMenu select={selectVerb} />
                        <ItemMenu handleHover={handleHover} select={selectItem} />
                    </>)}
                </Container>
            </Drawer>
            <EndingWrapper />
            {saveMenu}
        </>
    )
}