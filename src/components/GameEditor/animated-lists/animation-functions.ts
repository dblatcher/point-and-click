import { CSSProperties } from "react";

export type ItemPosition = { left: number; top: number };

const baseStyle: CSSProperties = {
    transition: 'transform .3s ease-in-out',
    transformOrigin: 'center',
    transformBox: 'border-box',
}

export const getInlineTransition = (
    transitionsOn: boolean,
    isNew: boolean,
    wasAt?: ItemPosition,
    nowAt?: ItemPosition,
): CSSProperties => {

    if (!transitionsOn) {
        return baseStyle
    }

    if (isNew) {
        return {
            ...baseStyle,
            transform: 'scaleX(0%)',
            transition: 'transform 0s',
        };
    }

    if (wasAt && nowAt) {
        const xShift = wasAt.left - nowAt.left;
        const yShift = wasAt.top - nowAt.top;
        if (!xShift && !yShift) {
            return baseStyle;
        }
        return {
            ...baseStyle,
            transform: `translateX(${xShift}px) translateY(${yShift}px) `,
            transition: 'transform 0s',
        };
    }

    return baseStyle;
};