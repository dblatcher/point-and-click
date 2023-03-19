import Head from 'next/head'
import { AppHeader } from '@/components/AppHeader'
import { Box } from '@mui/material'
import { ReactNode } from 'react'


interface Props {
    children: ReactNode
}

export function PageLayout({ children }: Props) {
    return (
        <>
            <Head>
                <title>Point and Click</title>
                <meta name="description" content="Point and Click" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Box sx={{ display: 'flex' }} paddingTop={'4rem'}>
                <AppHeader />
                <Box component='main' sx={{ width: '100%' }}>
                    {children}
                </Box>
            </Box>
        </>
    )
}
