import styles from './styles.module.css';


interface HotSpotOptions {
    highlight?: boolean,
    flash?: boolean,
}

export const hotpotClassNames = (options: HotSpotOptions = {}) => {
    const { highlight, flash } = options
    const classNames: string[] = []
    classNames.push(highlight ? styles.highlightedHotspot : styles.hotspot)

    if (flash) { classNames.push(styles.flash) }
    return classNames.join(" ")
}

interface ZoneOptions {
    disabled?: boolean,
    flash?: boolean,
    blink?: boolean,
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