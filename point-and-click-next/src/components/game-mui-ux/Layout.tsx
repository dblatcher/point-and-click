import { Box, Card, Container, useTheme } from "@mui/material";
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
                {soundToggle}
                {children}
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