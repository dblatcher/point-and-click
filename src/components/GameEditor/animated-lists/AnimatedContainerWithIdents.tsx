import type { CSSProperties, ReactNode } from 'react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

type Props<DataType> = {
    list: DataType[];
    represent: { (item: DataType, index: number): ReactNode };
    getIdent: { (item: DataType): string };
    nonUniqueIdents?: boolean;
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

const figureOutOldAndNewIndexes = (id: string, index: number, ordering: Ordering): [number, number] => {

    const oldOccurences = ordering.last.flatMap((otherId, index) => otherId === id ? [index] : []);
    const newOccurences = ordering.now.flatMap((otherId, index) => otherId === id ? [index] : []);

    let oldI = -1;
    let newI = -1;


    if (oldOccurences.length === 1) {
        oldI = oldOccurences[0]
    } else {
        const newIndexPlaceInNewOccurences = newOccurences.indexOf(index);
        oldI = oldOccurences[newIndexPlaceInNewOccurences];
    }

    if (newOccurences.length === 1) {
        newI = newOccurences[0]
    } else {
        newI = index
    }


    return [oldI, newI]
}

export const AnimatedContainerWithIdents = <DataType,>({
    list,
    getIdent,
    represent,
    nonUniqueIdents,
}: Props<DataType>) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const positionRef = useRef<PositionList>([]);
    const [ordering, setOrdering] = useState<Ordering>(() => ({
        last: list.map(getIdent),
        now: list.map(getIdent),
    }));

    const [transformsOn, setTransformsOn] = useState(false);

    const runTransforms = useCallback(() => {
        setTransformsOn(true);
        setTimeout(() => setTransformsOn(false), 300);
    }, []);

    useLayoutEffect(() => {
        setOrdering((oldOrdering) => ({
            last: oldOrdering.now,
            now: list.map(getIdent),
        }));

        const { current: container } = containerRef;

        if (container) {
            const items = Array.from(container.children) as HTMLDivElement[];
            positionRef.current = items.map((el) => ({
                left: el.offsetLeft,
                top: el.offsetTop,
            }));
        }
        runTransforms();
    }, [list, getIdent, runTransforms]);
    return (
        <div
            style={{
                display: 'contents',
                position: 'relative',
            }}
            ref={containerRef}
        >
            {list.map((item, index) => {
                const ident = getIdent(item)
                const [oldPlace, newPlace] = nonUniqueIdents
                    ? figureOutOldAndNewIndexes(ident, index, ordering)
                    : [ordering.last.indexOf(ident), ordering.now.indexOf(ident)]

                const wasAt = positionRef.current[oldPlace];
                const nowAt = positionRef.current[newPlace];
                return (
                    <div
                        key={`${index}_${ident}`}
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