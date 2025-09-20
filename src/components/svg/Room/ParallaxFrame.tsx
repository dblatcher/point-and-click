import { ReactNode } from "react"
import styles from "./styles.module.css"
import { useRoomRender } from "@/hooks/useRoomRender";

interface Props {
    interactive?: boolean,
    children?: ReactNode,
}


export const ParallaxFrame = ({ interactive, children }: Props) => {

    const { roomData: { frameWidth, height, frameHeight = height } } = useRoomRender()
    const className = interactive ? styles.roomSvgInteractive : styles.roomSvg;
    return <svg
        className={className}
        viewBox={`0 0 ${frameWidth} ${frameHeight}`}>
        {children}
    </svg>
}