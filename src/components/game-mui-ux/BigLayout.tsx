import { useGameState, useGameStateDerivations } from "@/context/game-state-context";
import { Box, Grid } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ResizeWatcher } from "../ResizeWatcher";
import { EndingWrapper } from "../game-ui/EndingScreen";
import { GameLayoutProps } from "../game/uiComponentSet";
import { CommandLine } from "./CommandLine";
import { ConversationMenu } from "./ConversationMenu";
import { ItemMenu } from "./ItemMenu";
import { VerbMenu } from "./VerbMenu";
import { screenSizeAction } from "@/lib/game-state-logic/game-state-reducer";


export const BigLayout = ({
    children,
    saveMenu,
}: GameLayoutProps) => {
    const { updateGameState } = useGameState()
    const { isConversationRunning, isSequenceRunning } = useGameStateDerivations()
    const [initialResize, setInitialResize] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (containerRef.current && !initialResize) {
            setInitialResize(true)
            updateGameState(screenSizeAction(containerRef.current.clientWidth - 20, containerRef.current.clientHeight - 60))
        }
    }, [updateGameState, initialResize, setInitialResize])

    // TO DO - the resize handler could use the size of the container div instead of the whole document body
    return (
        <ResizeWatcher resizeHandler={() => {
            if (containerRef.current) {
                updateGameState(screenSizeAction(containerRef.current.clientWidth - 20, containerRef.current.clientHeight - 60))
            } else {
                console.log('no ref')
            }
        }}>
            <Box position={'fixed'} top={0} right={0}>
                {saveMenu}
            </Box>

            <div
                ref={containerRef}
                style={{
                    flex: '1',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    paddingTop: 10,
                }}>
                {children}
            </div>

            <div style={{ margin: '0 auto', minHeight: 100 }}>
                <Box maxWidth={'lg'}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexBasis: 100,
                        justifyContent: 'flex-end',
                        flexShrink: 0,
                    }}>
                    {!isSequenceRunning && (<>
                        {isConversationRunning ? (
                            <ConversationMenu />
                        ) : <>
                            <CommandLine boxProps={{
                                paddingX: 4,
                                paddingY: 1,
                            }} />
                            <Grid container maxWidth={'lg'}>
                                <Grid item xs={5}>
                                    <VerbMenu />
                                </Grid>
                                <Grid item xs={7}>
                                    <ItemMenu />
                                </Grid>
                            </Grid>
                        </>}
                    </>)}
                </Box>
            </div>
            <EndingWrapper />
        </ResizeWatcher>
    )
}