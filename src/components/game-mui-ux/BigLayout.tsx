import { Box, Button, Container, Drawer, Stack } from "@mui/material";
import { useRef, useState } from "react";
import { ResizeWatcher } from "../ResizeWatcher";
import { EndingWrapper } from "../game-ui/EndingScreen";
import { useGameStateDerivations } from "../game/game-state-context";
import { GameLayoutProps } from "../game/uiComponentSet";
import { CommandLine } from "./CommandLine";
import { ConversationMenu } from "./ConversationMenu";
import { ItemMenu } from "./ItemMenu";
import { VerbMenu } from "./VerbMenu";


export const BigLayout = ({
    children,
    selectVerb, selectConversation, selectItem, handleHover, setScreenSize,
    saveMenu,
}: GameLayoutProps) => {
    const { isConversationRunning, isSequenceRunning } = useGameStateDerivations()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // TO DO - the resize handler could use the size of the container div instead of the whole document body
    return (
        <ResizeWatcher resizeHandler={() => {
            if (containerRef.current) {
                setScreenSize(containerRef.current.clientWidth - 20, containerRef.current.clientHeight - 20)
            } else {
                console.log('no ref')
            }
        }}>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} paddingX={2}>
                <CommandLine />
                {saveMenu}
            </Stack>

            <div
                ref={containerRef}
                style={{
                    flex: '1',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                {children}
            </div>

            <Box>
                <Button variant="contained" size="large" fullWidth color="secondary" disabled={isConversationRunning}
                    onClick={() => { setDrawerOpen(!drawerOpen) }}>OPEN</Button>
            </Box>

            <Drawer open={isConversationRunning && !isSequenceRunning} anchor="bottom" variant="persistent" PaperProps={{ sx: { padding: 1 } }}>
                <Container maxWidth={'lg'}>
                    <ConversationMenu select={selectConversation} />
                </Container>
            </Drawer>

            <Drawer open={drawerOpen && !isConversationRunning} anchor="bottom" variant="persistent" PaperProps={{ sx: { padding: 1 } }}>
                <Button variant="contained" onClick={() => { setDrawerOpen(!drawerOpen) }} color="secondary">CLOSE</Button>
                <Container maxWidth={'md'}>
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
        </ResizeWatcher>
    )
}