import styles from './styles.module.css';

export interface ZoneOptions {
    disabled?: boolean,
    flash?: boolean,
    blink?: boolean,
}

type HotSpotOptions = ZoneOptions & {
    highlight?: boolean,
    markVertices?: boolean
}

export const hotpotClassNames = (options: HotSpotOptions = {}) => {
    const { highlight, markVertices } = options
    const baseClass = markVertices || highlight ? styles.highlightedHotspot : styles.hotspot
    return zoneClassNames(baseClass, options)
}

const zoneClassNames = (base: string, options: ZoneOptions = {}) => {
    const { disabled, flash, blink } = options
    const classNames: string[] = [base]
    if (disabled) { classNames.push(styles.disabledZone) }
    if (flash) { classNames.push(styles.flash) }
    if (blink) { classNames.push(styles.blink) }
    return classNames.join(" ")
}

export const walkableClassNames = (options: ZoneOptions = {}) => {
    return zoneClassNames(styles.walkableArea, options)
}

export const obstableClassNames = (options: ZoneOptions = {}) => {
    return zoneClassNames(styles.obstacleArea, options)
}