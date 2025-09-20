import { useRoomRender } from "@/hooks/useRoomRender"
import { ReactNode } from "react"
import styles from './styles.module.css'

interface Props {
    children: ReactNode
}

export const SurfaceFrame = ({ children }: Props) => {
    const { roomData: { width, height, frameHeight = height, frameWidth }, viewAngleY, viewAngleX, scale } = useRoomRender()

    const differenceInHeight = (height - frameHeight) * scale;
    const top = (-differenceInHeight / 2) + (viewAngleY * differenceInHeight / 2);
    const differenceInWidth = (width - frameWidth) * scale;
    const left = (-differenceInWidth / 2) + (viewAngleX * differenceInWidth / 2);

    return <svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" preserveAspectRatio="none"
        style={{
            width: width * scale,
            height: height * scale,
            transform: `translateY(${top}px) translateX(${left}px)`,
        }}
        className={styles.roomSvg}
        viewBox={`0 0 ${width} ${height}`}
    >
        {children}
    </svg>

}