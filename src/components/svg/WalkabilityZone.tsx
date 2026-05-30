import { css, type SerializedStyles } from "@emotion/react"
import { useRoomRender, ZoneShape } from "point-click-components"
import type { Zone } from "point-click-lib"



interface Props {
    zone: Zone,
    markVertices: boolean
    zoneType: 'walkable' | 'obstacle'
    className?: string,
}


const styles = {
    obstacleArea: css({
        stroke: 'white',
        fill: 'rgba(255, 100, 100, .8)',
    }),
    disabledObstacleArea: css({
        stroke: 'white',
        fill: 'rgba(255, 100, 100, .4)',
        strokeDasharray: '1, 3',
    }),
    walkableArea: css({
        stroke: 'white',
        fill: 'rgba(100, 255, 100, .8)',
    }),
    disabledWalkableArea: css({
        stroke: 'white',
        fill: 'rgba(100, 255, 100, .4)',
        strokeDasharray: '1, 3',
    }),
}

const getCss = (
    zoneType: 'walkable' | 'obstacle',
    disabled?: boolean,
): SerializedStyles => {
    switch (zoneType) {
        case "walkable":
            return disabled ? styles.disabledWalkableArea : styles.walkableArea;
        case "obstacle":
            return disabled ? styles.disabledObstacleArea : styles.obstacleArea;
    }
}


export const WalkabilityZone = ({ zone, markVertices, zoneType, className }: Props) => {
    const { roomData, surfaceXOffcenter, surfaceYOffcenter } = useRoomRender()
    const shapeSerialisedStyle = getCss(zoneType, zone.disabled)
    const x = zone.x + surfaceXOffcenter
    const y = roomData.height - zone.y + surfaceYOffcenter;

    return <svg
        x={x} y={y}
        style={{ overflow: 'visible', fill: 'transparent' }}
    >
        <ZoneShape
            className={className}
            shapeSerialisedStyle={shapeSerialisedStyle}
            zone={zone}
            markVertices={markVertices}
        />
    </svg>
}