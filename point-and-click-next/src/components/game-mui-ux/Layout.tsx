import { Box, Card, Container, Grid, useTheme } from "@mui/material";
import { GameLayoutProps } from "../game/uiComponentSet";


export const Layout = ({
    children,
    verbMenu, itemMenu, commandLine, conversationMenu, endingScreen,
    saveMenu, soundToggle,
    isConversationRunning, isGameEnded, isSequenceRunning
}: GameLayoutProps) => {
    const theme = useTheme()
    return (
        <Container maxWidth={'md'} sx={{ paddingY: .5, marginY: 2 }}>
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
    )
}