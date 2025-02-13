import Head from 'next/head'
import { AppHeader } from '@/components/AppHeader'
import { Box, BoxProps } from '@mui/material'
import { ReactNode, useState } from 'react'
import { PageMetaProvider } from '@/context/page-meta-context'


interface Props {
    children: ReactNode
    noPageScroll?: boolean
}

const standardOuterBoxProps: BoxProps = {
    display: 'flex', paddingTop: '4rem',
}
const standardInnerBoxProps: BoxProps = {
    sx: { width: '100%' }, flexBasis: "100%",
}

const noPageScrollOuterBoxProps: BoxProps = {
    display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', position:'relative',
}
const noPageScrollInnerBoxProps: BoxProps = {
    sx: { width: '100%', flexBasis: '100%', flexGrow: 0, overflow: 'hidden' }, display: 'flex', flexDirection: 'column', position:'relative',
}


export function PageLayout({ children, noPageScroll }: Props) {
    const outerBoxProps = noPageScroll ? noPageScrollOuterBoxProps : standardOuterBoxProps;
    const innerBoxProps = noPageScroll ? noPageScrollInnerBoxProps : standardInnerBoxProps;

    const [headerContent, setHeaderContent] = useState<ReactNode>(null)

    return (
        <PageMetaProvider value={{ setHeaderContent }}>
            <Head>
                <title>Point and Click</title>
                <meta name="description" content="Point and Click" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Box {...outerBoxProps} className='LAYOUT_OUTER'>
                <AppHeader position={noPageScroll ? 'relative' : undefined} >
                    {headerContent}
                </AppHeader>
                <Box {...innerBoxProps} className='LAYOUT_INNER'>
                    {children}
                </Box>
            </Box>
        </PageMetaProvider>
    )
}
