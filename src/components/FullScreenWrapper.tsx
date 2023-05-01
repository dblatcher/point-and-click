import { useEffect, useRef, useState, ReactNode, memo } from "react"
import FullScreen from "@mui/icons-material/Fullscreen"
import { IconButton, IconButtonProps, } from "@mui/material";
import Box from "@mui/material/Box";

const defaultIconButtonProps: IconButtonProps = {
    sx: {
        position: 'absolute',
        top: 0,
        right: 16,
        zIndex: 1000,
    },
    color: "primary"
}

export const FullScreenWrapper = memo(function FullScreenWrapper(props: {
    children: ReactNode
    iconButtonProps?: IconButtonProps
}) {
    const wrapper = useRef<HTMLDivElement>(null);
    const [isFullScreen, setIsFullScreen] = useState(false)

    const iconButtonProps = props.iconButtonProps ?? defaultIconButtonProps

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
                {...iconButtonProps}
                onClick={requestFullScreen}>
                <FullScreen />
            </IconButton>
        )}
    </Box>
})