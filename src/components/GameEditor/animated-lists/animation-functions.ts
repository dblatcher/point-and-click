import { CSSProperties } from "react";

export type ItemPosition = {
    left: number;
    top: number;
    width: number;
    height: number;
};

const baseStyle = (transitionDuration: number): CSSProperties => ({
    transition: `transform ${transitionDuration}ms ease-in-out`,
    transformOrigin: 'center',
    transformBox: 'border-box',
})

export const getInlineTransition = (
    duration: number,
    transitionsOn: boolean,
    isNew: boolean,
    wasAt?: ItemPosition,
    nowAt?: ItemPosition,
): CSSProperties => {

    if (!transitionsOn) {
        return baseStyle(duration)
    }

    if (isNew) {
        return {
            ...baseStyle(duration),
            transform: 'scaleX(0%)',
            transition: 'transform 0s',
        };
    }

    if (wasAt && nowAt) {
        const xShift = wasAt.left - nowAt.left;
        const yShift = wasAt.top - nowAt.top;
        if (!xShift && !yShift) {
            return baseStyle(duration);
        }
        return {
            ...baseStyle(duration),
            transform: `translateX(${xShift}px) translateY(${yShift}px) `,
            transition: 'transform 0s',
        };
    }

    return baseStyle(duration);
};