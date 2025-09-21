import { ReactNode } from "react"
import styles from "./styles.module.css"
import { useRoomRender } from "@/hooks/useRoomRender";

interface Props {
    children?: ReactNode,
}


export const ParallaxFrame = ({ children }: Props) => {

    const { roomData: { frameWidth, height, frameHeight = height } } = useRoomRender()
    return <svg
        className={ styles.roomSvg}
        viewBox={`0 0 ${frameWidth} ${frameHeight}`}>
        {children}
    </svg>
}