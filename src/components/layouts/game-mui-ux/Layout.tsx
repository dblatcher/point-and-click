import { useGameStateDerivations } from "@/components/layouts/use-derivations";
import { Box, Card, Container, Grid, useTheme } from "@mui/material";
import { FullScreenWrapper } from "../../FullScreenWrapper";
import { CommandLine } from "./CommandLine";
import { ConversationMenu } from "./ConversationMenu";
import { DialogSaveMenu } from "../shared-mui-components/DialogSaveMenu";
import { ItemMenu } from "./ItemMenu";
import { SoundToggle } from "../shared-mui-components/SoundToggle";
import { VerbMenu } from "./VerbMenu";
import { ContextualGameRoom } from "point-click-components";
import { StoryBoardPlayer } from "../../storyboard/StoryBoardPlayer";

export const MaterialLayout = () => {
    const theme = useTheme()
    const { isConversationRunning, isSequenceRunning, currentStoryBoard } = useGameStateDerivations()
    if (currentStoryBoard) {
        return <StoryBoardPlayer storyBoard={currentStoryBoard} />
    }

    return (
        <Container maxWidth={'md'} sx={{ paddingY: .5, marginY: 2 }}>
            <Box position={'fixed'} top={0} right={0}>
                <DialogSaveMenu />
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
                            <Grid item xs={10}><ContextualGameRoom /></Grid>
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