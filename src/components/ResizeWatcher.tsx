import { ReactNode, useCallback, useEffect, useState } from "react"

interface Props {
    resizeHandler: { (): void }
    children: ReactNode
}


export const ResizeWatcher = ({ children, resizeHandler }: Props) => {
    const [haveResized, setHaveResized] = useState(false)
    const resize = useCallback(() => {
        resizeHandler()
    }, [resizeHandler])

    useEffect(() => {
        if (!haveResized) {
            setHaveResized(true)
            resize()
        }
    }, [setHaveResized, haveResized, resize])

    useEffect(() => {
        if (!window) {
            return () => { }
        }
        window.addEventListener('resize', resize)
        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [setHaveResized, haveResized, resize])

    return <>{children}</>
}