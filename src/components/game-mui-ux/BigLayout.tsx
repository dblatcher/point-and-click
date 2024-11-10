import { useGameStateDerivations } from "@/context/game-state-context";
import { Box, Grid } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ResizeWatcher } from "../ResizeWatcher";
import { EndingWrapper } from "../game-ui/EndingScreen";
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
    const [initialResize, setInitialResize] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (containerRef.current && !initialResize) {
            setInitialResize(true)
            setScreenSize(containerRef.current.clientWidth - 20, containerRef.current.clientHeight - 60)
        }
    }, [setScreenSize, initialResize, setInitialResize])

    // TO DO - the resize handler could use the size of the container div instead of the whole document body
    return (
        <ResizeWatcher resizeHandler={() => {
            if (containerRef.current) {
                setScreenSize(containerRef.current.clientWidth - 20, containerRef.current.clientHeight - 60)
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

            <div style={{ margin: '0 auto', minHeight:100 }}>
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
                            <ConversationMenu select={selectConversation} />
                        ) : <>
                            <CommandLine boxProps={{
                                paddingX: 4,
                                paddingY: 1,
                            }} />
                            <Grid container maxWidth={'lg'}>
                                <Grid item xs={5}>
                                    <VerbMenu select={selectVerb} />
                                </Grid>
                                <Grid item xs={7}>
                                    <ItemMenu handleHover={handleHover} select={selectItem} />
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