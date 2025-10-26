import { useCallback, useRef, useState } from "react";
import { ItemPosition } from "./animation-functions";


export const useTransformTransition = (delay = 1) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const positionBeforeRef = useRef<ItemPosition[]>([]);
    const positionRef = useRef<ItemPosition[]>([]);
    const [transformsOn, setTransformsOn] = useState(false);

    const runTransforms = useCallback(() => {
        setTransformsOn(true);
        setTimeout(() => setTransformsOn(false), delay);
    }, [delay]);

    const storePositioning = () => {
        const { current: container } = containerRef;
        if (container) {
            positionBeforeRef.current = [...positionRef.current]
            const items = Array.from(container.children) as HTMLDivElement[];
            positionRef.current = items.map((el) => ({
                left: el.offsetLeft,
                top: el.offsetTop,
                width: el.offsetWidth,
                height: el.offsetHeight,
            }));
        }
    }

    const updatePositions = useCallback(() => {
        storePositioning();
        runTransforms();
    }, [runTransforms])

    return {
        transformsOn,
        updatePositions,
        containerRef,
        positions: positionRef.current,
        positionBefore: positionBeforeRef.current
    }
}