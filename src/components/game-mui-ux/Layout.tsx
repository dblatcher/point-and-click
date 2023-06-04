import { Card, Container, Grid, useTheme } from "@mui/material";
import { GameLayoutProps } from "../game/uiComponentSet";
import { FullScreenWrapper } from "../FullScreenWrapper";
import { useGameStateDerivations } from "../game/game-state-context";
import { SoundToggle } from "./SoundToggle";
import { CommandLine } from "./CommandLine";


export const Layout = ({
    children,
    verbMenu, itemMenu, conversationMenu, endingScreen,
    saveMenu,
}: GameLayoutProps) => {
    const theme = useTheme()
    const { isConversationRunning, isGameEnded, isSequenceRunning } = useGameStateDerivations()

    return (
        <Container maxWidth={'md'} sx={{ paddingY: .5, marginY: 2 }}>
            <FullScreenWrapper iconButtonProps={{
                sx: {
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    marginX: 4,
                    marginY: .5,
                },
                color: 'primary',
            }}>
                <Container maxWidth={'md'} >
                    <Card sx={{ padding: 1, background: theme.palette.secondary.light }}>
                        <Grid container>
                            <Grid item xs={1}><SoundToggle /></Grid>
                            <Grid item xs={10}>{children}</Grid>
                            <Grid item xs={1} />
                        </Grid>
                        <Card sx={{ marginY: 1, padding: 1, background: theme.palette.grey[50] }}>
                            {isConversationRunning ? (
                                <>
                                    {!isSequenceRunning && conversationMenu}
                                </>
                            ) : (<>
                                <CommandLine />
                                {verbMenu}
                                {itemMenu}
                            </>)}
                        </Card>
                    </Card>
                    {isGameEnded && endingScreen}
                    {saveMenu}
                </Container>
            </FullScreenWrapper>
        </Container>
    )
}