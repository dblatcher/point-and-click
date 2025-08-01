import { Box, Card, Container, Grid, useTheme } from "@mui/material";
import { FullScreenWrapper } from "../FullScreenWrapper";
import { useGameStateDerivations } from "@/context/game-state-context";
import { SoundToggle } from "./SoundToggle";
import { CommandLine } from "./CommandLine";
import { VerbMenu } from "./VerbMenu";
import { ConversationMenu } from "./ConversationMenu";
import { ItemMenu } from "./ItemMenu";
import { SaveMenuWrapper } from "../game/SaveMenuWrapper";
import { DialogSaveMenu } from "./DialogSaveMenu";
import { RoomWrapper } from "../game/RoomWrapper";


export const Layout = () => {
    const theme = useTheme()
    const { isConversationRunning, isSequenceRunning } = useGameStateDerivations()

    return (
        <Container maxWidth={'md'} sx={{ paddingY: .5, marginY: 2 }}>
            <Box position={'fixed'} top={0} right={0}>
                <SaveMenuWrapper SaveMenuComponent={DialogSaveMenu} />
            </Box>
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
                            <Grid item xs={10}><RoomWrapper /></Grid>
                            <Grid item xs={1} />
                        </Grid>
                        <Card sx={{ marginY: 1, padding: 1, background: theme.palette.grey[50] }}>
                            {isConversationRunning ? (
                                <>
                                    {!isSequenceRunning && <ConversationMenu />}
                                </>
                            ) : (<>
                                <CommandLine />
                                <VerbMenu />
                                <ItemMenu />
                            </>)}
                        </Card>
                    </Card>
                </Container>
            </FullScreenWrapper>
        </Container>
    )
}