import type { CSSProperties, ReactNode } from 'react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

type Props<DataType> = {
    list: DataType[];
    represent: { (item: DataType, index: number): ReactNode };
    oldPositions: number[];

};

type Ordering = {
    last: string[];
    now: string[];
};

type PositionList = Array<{ left: number; top: number }>;

const itemCss: CSSProperties = {
    transition: 'transform .3s ease-in-out',
    transformOrigin: 'center',
    transformBox: 'content-box',
}

const getInlineTransition = (
    isNew: boolean,
    wasAt?: { left: number; top: number },
    nowAt?: { left: number; top: number },
): CSSProperties | undefined => {
    if (isNew) {
        return {
            ...itemCss,
            transform: 'scaleX(0%)',
            transition: 'transform 0s',
        };
    }

    if (wasAt && nowAt) {
        const xShift = wasAt.left - nowAt.left;
        const yShift = wasAt.top - nowAt.top;
        if (!xShift && !yShift) {
            return itemCss;
        }
        return {
            ...itemCss,
            transform: `translateX(${xShift}px) translateY(${yShift}px) `,
            transition: 'transform 0s',
        };
    }

    return itemCss;
};


export const AnimatedContainerWithIndexList = <DataType,>({
    list,
    represent,
    oldPositions
}: Props<DataType>) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const positionRef = useRef<PositionList>([]);


    const [transformsOn, setTransformsOn] = useState(false);

    const runTransforms = useCallback(() => {
        setTransformsOn(true);
        setTimeout(() => setTransformsOn(false), 300);
    }, []);

    useLayoutEffect(() => {
        const { current: container } = containerRef;
        console.log(oldPositions)
        if (container) {
            const items = Array.from(container.children) as HTMLDivElement[];
            console.log('item', items.length)
            positionRef.current = items.map((el) => ({
                left: el.offsetLeft,
                top: el.offsetTop,
            }));
        }
        runTransforms();
    }, [oldPositions, runTransforms]);

    return (
        <div
            style={{
                display: 'contents',
                position: 'relative',
            }}
            ref={containerRef}
        >
            {list.map((item, index) => {
                const oldPlace = oldPositions[index]
                const wasAt = positionRef.current[oldPlace];
                const nowAt = positionRef.current[index];
                return (
                    <div
                        key={`${index}_${oldPlace}`}
                        style={
                            transformsOn
                                ? getInlineTransition(oldPlace === -1, wasAt, nowAt)
                                : itemCss
                        }
                    >
                        {represent(item, index)}
                    </div>
                );
            })}
        </div>
    );
};