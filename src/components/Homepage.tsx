import featuresAndDetails from "@/content/featuresAndDetails.md";
import content from "@/content/homepage.md";
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import SchoolIcon from '@mui/icons-material/School';
import { Box, Card, Grid, Typography } from "@mui/material";
import { LinkCard } from "./LinkCard";
import { MarkDown } from "./MarkDown";

export const Homepage = () => {

    return <>
        <Box padding={2}>
            <Card sx={{ padding: 2 }}>
                <Typography variant="h2">This is Point and Click</Typography>
                <MarkDown content={content} />
            </Card>
        </Box>

        <Grid container spacing={2} padding={2} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
                <LinkCard
                    title="Game Loader"
                    href="./game-loader"
                    Icon={PlayCircleOutlineOutlinedIcon}
                >
                    <Typography>Play your own games or load someone else&apos;s.</Typography>
                </LinkCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <LinkCard
                    title="Game Designer"
                    href="./editor"
                    Icon={DesignServicesIcon}
                >
                    <Typography>Create your own adventure game.</Typography>
                </LinkCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <LinkCard
                    title="Tutorial"
                    href="./editor-tutorial"
                    Icon={SchoolIcon}
                >
                    <Typography>Learn to use the editor.</Typography>
                </LinkCard>
            </Grid>
        </Grid>

        <Box padding={2}>
            <Card sx={{ padding: 2 }}>
                <MarkDown content={featuresAndDetails} />
            </Card>
        </Box>
    </>
}