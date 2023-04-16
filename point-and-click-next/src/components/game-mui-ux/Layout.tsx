import { Card, Container, Grid, useTheme } from "@mui/material";
import { GameLayoutProps } from "../game/uiComponentSet";
import { FullScreenWrapper } from "../FullScreenWrapper";


export const Layout = ({
    children,
    verbMenu, itemMenu, commandLine, conversationMenu, endingScreen,
    saveMenu, soundToggle,
    isConversationRunning, isGameEnded, isSequenceRunning
}: GameLayoutProps) => {
    const theme = useTheme()
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
                            <Grid item xs={1}>{soundToggle}</Grid>
                            <Grid item xs={10}>{children}</Grid>
                            <Grid item xs={1} />
                        </Grid>
                        <Card sx={{ marginY: 1, padding: 1, background: theme.palette.grey[50] }}>
                            {isConversationRunning ? (
                                <>
                                    {!isSequenceRunning && conversationMenu}
                                </>
                            ) : (<>
                                {commandLine}
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