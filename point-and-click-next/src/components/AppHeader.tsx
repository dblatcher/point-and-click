import { AppBar, IconButton, Typography, Drawer, List, ListItem } from '@mui/material'
import Toolbar from '@mui/material/Toolbar';
import { useState } from 'react';
import { LinkButton } from './LinkButton';
import MenuIcon from '@mui/icons-material/Menu';


export function AppHeader() {

    const [drawerOpen, setDrawerOpen] = useState(false)

    return (
        <AppBar component='header'>
            <Toolbar>
                <IconButton onClick={() => { setDrawerOpen(!drawerOpen) }}>
                    <MenuIcon htmlColor='white' />
                </IconButton>
                <Typography component="div" sx={{ flexGrow: 1 }}>
                    Point and Click
                </Typography>
            </Toolbar>
            <Drawer
                anchor={'left'}
                open={drawerOpen}
                onClose={() => { setDrawerOpen(false) }}
            >
                <List>
                    <ListItem>
                        <LinkButton href="/" sx={{ flex: 1 }}>home page</LinkButton>
                    </ListItem>
                    <ListItem>
                        <LinkButton href="/game-loader" sx={{ flex: 1 }}>game loader</LinkButton>
                    </ListItem>
                    <ListItem>
                        <LinkButton href="/prebuilt-game" sx={{ flex: 1 }}>prebuilt game</LinkButton>
                    </ListItem>
                </List>
            </Drawer>
        </AppBar>
    )
}
