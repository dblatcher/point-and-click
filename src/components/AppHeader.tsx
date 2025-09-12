import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Drawer, IconButton, List, ListItem, Typography } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import { LinkButton } from './LinkButton';

interface Props {
    position?: "fixed" | "relative" | "absolute" | "sticky" | "static" | undefined,
    children?: ReactNode
}

const navItems: { label: string, href: string }[] = [
    { label: 'homepage', href: '/' },
    { label: 'game loader', href: '/game-loader' },
    { label: 'prebuilt game', href: '/prebuilt-game' },
    { label: 'text prebuilt game', href: '/prebuilt-text-game' },
    { label: 'game editor', href: '/editor' },
]

export function AppHeader({ position, children }: Props) {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const router = useRouter()
    const { pathname } = router
console.log(children)
    return (
        <AppBar component='header' position={position}>
            <Toolbar>
                <IconButton onClick={() => { setDrawerOpen(!drawerOpen) }}>
                    <MenuIcon htmlColor='white' />
                </IconButton>
                <Box display={'flex'} flexDirection={'column'} flex={1}>
                    {!children && <Typography component="div">Point and Click</Typography>}
                    {children}
                </Box>
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
