import { AppBar, IconButton, Typography, Drawer, List, ListItem } from '@mui/material'
import Toolbar from '@mui/material/Toolbar';
import { useState } from 'react';
import { LinkButton } from './LinkButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/router'


const navItems: { label: string, href: string }[] = [
    { label: 'homepage', href: '/' },
    { label: 'game loader', href: '/game-loader' },
    { label: 'prebuilt game', href: '/prebuilt-game' },
    { label: 'game editor', href: '/editor' },
]

export function AppHeader() {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const router = useRouter()
    const { pathname } = router

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
                    {navItems.map(item => (
                        <ListItem key={item.href}>
                            <LinkButton
                                disabled={item.href === pathname}
                                href={item.href}
                                sx={{ flex: 1 }}>
                                {item.label}
                            </LinkButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </AppBar>
    )
}
