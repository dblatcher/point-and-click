import { Box, Card, Container, Grid, useTheme } from "@mui/material";
import { GameLayoutProps } from "../game/uiComponentSet";
import { UiContainer } from "./UiContainer";


export const Layout = ({
    children,
    verbMenu, itemMenu, commandLine, conversationMenu, endingScreen,
    saveMenu, soundToggle,
    isConversationRunning, isGameEnded, isSequenceRunning
}: GameLayoutProps) => {
    const theme = useTheme()
    return (
        <Container maxWidth={'md'} sx={{ paddingY: .5 }}>
            <Card sx={{ padding: 1, background: theme.palette.primary.light }}>
                {soundToggle}
                {children}
                {isGameEnded && endingScreen}

                <Box sx={{ minHeight: 200 }}>
                    {isConversationRunning ? (
                        <>
                            {!isSequenceRunning && conversationMenu}
                        </>
                    ) : (
                        <>
                            {commandLine}
                            {verbMenu}
                            {itemMenu}
                        </>
                    )}
                </Box>
            </Card>
            {saveMenu}
        </Container>)
}