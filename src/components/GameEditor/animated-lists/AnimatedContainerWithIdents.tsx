import type { ReactNode } from 'react';
import { useLayoutEffect, useState } from 'react';
import { getInlineTransition } from './animation-functions';
import { useTransformTransition } from './useTransformTransition';

type Props<DataType> = {
    list: DataType[];
    represent: { (item: DataType, index: number): ReactNode };
    getIdent: { (item: DataType): string };
    transitionDuration?: number;
};

type Ordering = {
    last: string[];
    now: string[];
};


export const AnimatedContainerWithIdents = <DataType,>({
    list,
    getIdent,
    represent,
    transitionDuration = 500
}: Props<DataType>) => {

    const { transformsOn, updatePositions, containerRef, positions, positionBefore } = useTransformTransition()
    const [ordering, setOrdering] = useState<Ordering>(() => ({
        last: list.map(getIdent),
        now: list.map(getIdent),
    }));

    useLayoutEffect(() => {
        setOrdering((oldOrdering) => ({
            last: oldOrdering.now,
            now: list.map(getIdent),
        }));
        updatePositions()
    }, [list, getIdent, updatePositions]);

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
                const oldPlace = ordering.last.indexOf(ident);
                const newPlace = ordering.now.indexOf(ident);

                const wasAt = positionBefore[oldPlace];
                const nowAt = positions[newPlace];
                return (
                    <div
                        key={`${index}_${ident}`}
                        style={getInlineTransition(transitionDuration, transformsOn, oldPlace === -1, wasAt, nowAt)}
                    >
                        {represent(item, index)}
                    </div>
                );
            })}
        </div>
    );
};