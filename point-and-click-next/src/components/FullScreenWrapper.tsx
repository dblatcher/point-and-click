import { CSSProperties, useEffect, useRef, useState, ReactNode } from "react"
import FullScreen from "@mui/icons-material/Fullscreen"
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";

export default function FullScreenWrapper(props: {
    children: ReactNode
}) {
    const wrapper = useRef<HTMLDivElement>(null);
    const [isFullScreen, setIsFullScreen] = useState(false)

    function requestFullScreen() {
        wrapper.current?.requestFullscreen()
    }

    function handleFullScreenChange(event: Event) {
        setIsFullScreen(document.fullscreenElement === wrapper.current)
    }

    useEffect(() => {
        const { current: element } = wrapper;
        if (!element) { return }

        element.addEventListener('fullscreenchange', handleFullScreenChange)
        return () => {
            element.removeEventListener('fullscreenchange', handleFullScreenChange)
        }
    })

    return <Box ref={wrapper} sx={{ position: 'relative' }}>
        {props.children}
        {!isFullScreen && (
            <IconButton
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 16,
                    zIndex: 1000,
                }}
                color="primary"
                onClick={requestFullScreen}>
                <FullScreen />
            </IconButton>
        )}
    </Box>
}