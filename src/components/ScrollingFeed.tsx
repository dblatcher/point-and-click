import { Box, BoxProps } from "@mui/material";
import { CSSProperties, ReactNode, useEffect, useRef } from "react";
interface Props {
    feed: ReactNode[]
    maxHeight?: CSSProperties['maxHeight']
    boxProps?: BoxProps
    listProps?: BoxProps
}

export const ScrollingFeed = ({ feed, maxHeight = '100%', boxProps, listProps }: Props) => {

    const listRef = useRef<HTMLUListElement>(null)
    useEffect(() => {
        const { current: listElement } = listRef
        if (!listElement) { return }
        listElement.scrollTo({ left: 0, top: listElement.scrollHeight, behavior: 'smooth' })
    }, [feed.length])


    return <Box style={{ maxHeight }} {...boxProps}>
        <Box component={'ul'} ref={listRef} style={{
            minHeight: '100%',
            maxHeight: '100%',
            margin: 0,
            overflowY: 'scroll',
            overflowX: 'hidden',
        }} {...listProps}>
            {feed.map((entry, index) => (
                <li key={index}>{entry}</li>
            ))}
        </Box>
    </Box>
}



