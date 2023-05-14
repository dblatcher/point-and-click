import Head from 'next/head'
import { AppHeader } from '@/components/AppHeader'
import { Box, BoxProps } from '@mui/material'
import { ReactNode } from 'react'


interface Props {
    children: ReactNode
    noPageScroll?: boolean
}

const standardOuterBoxProps: BoxProps = {
    display: 'flex', paddingTop: '4rem',
}
const standardInnerBoxProps: BoxProps = {
    sx: { width: '100%' },
}

const noPageScrollOuterBoxProps: BoxProps = {
    display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden',
}
const noPageScrollInnerBoxProps: BoxProps = {
    sx: { width: '100%' }, flex: 1,
}

export function PageLayout({ children, noPageScroll }: Props) {
    const outerBoxProps = noPageScroll ? noPageScrollOuterBoxProps : standardOuterBoxProps;
    const innerBoxProps = noPageScroll ? noPageScrollInnerBoxProps : standardInnerBoxProps;
    return (
        <>
            <Head>
                <title>Point and Click</title>
                <meta name="description" content="Point and Click" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Box {...outerBoxProps}>
                <AppHeader position={noPageScroll ? 'relative' : undefined} />
                <Box {...innerBoxProps}>
                    {children}
                </Box>
            </Box>
        </>
    )
}
