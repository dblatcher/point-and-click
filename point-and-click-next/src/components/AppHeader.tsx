import { AppBar, Typography } from '@mui/material'
import Link from 'next/link'


export default function AppHeader() {
    return (
        <AppBar component='header'>
            <Typography component="div" sx={{ flexGrow: 1 }}>
                <Link href={'/'}>Point and Click</Link>
            </Typography>
        </AppBar>
    )
}
