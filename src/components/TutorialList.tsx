

import tutorialContent from "@/content/tutorials.md";
import { tutorials } from '@/lib/tutorials';
import { Box, Card, Container, List, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@mui/material';
import { useRouter } from "next/router";
import { MouseEvent } from "react";
import { SchoolIcon } from './GameEditor/material-icons';
import { MarkDown } from './MarkDown';


export const TutorialList = () => {

    const router = useRouter()
    const navigate = (href: string) => (event: MouseEvent) => {
        event.preventDefault()
        router.push(href)
    }

    return (<>
        <Container maxWidth="lg">
            <Box padding={2}>
                <Card sx={{ padding: 2 }}>
                    <Typography variant={'h2'}>Tutorials</Typography>
                    <MarkDown content={tutorialContent} />
                </Card>
            </Box>
        </Container>
        <Container maxWidth="sm">
            <Box padding={2}>
                <Card sx={{ padding: 2 }}>
                    <List>
                        {tutorials.map((tutorial, index) => (
                            <ListItemButton key={index}
                                href={`/tutorial/${tutorial.path}`}
                                onClick={navigate(`/tutorial/${tutorial.path}`)}
                            >
                                <ListItemAvatar><SchoolIcon fontSize="large"/></ListItemAvatar>
                                <ListItemText primary={tutorial.title} secondary={tutorial.description} />
                            </ListItemButton>
                        ))}
                    </List>
                </Card>
            </Box>
        </Container>
    </>
    )
}
