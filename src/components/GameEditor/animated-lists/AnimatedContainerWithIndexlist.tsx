import type { ReactNode } from 'react';
import { useLayoutEffect } from 'react';
import { getInlineTransition } from './animation-functions';
import { useTransformTransition } from './useTransformTransition';

type Props<DataType> = {
    list: DataType[];
    represent: { (item: DataType, index: number): ReactNode };
    oldPositions: number[];
    transitionDuration?: number;
};

export const AnimatedContainerWithIndexList = <DataType,>({
    list,
    represent,
    oldPositions,
    transitionDuration = 300
}: Props<DataType>) => {
    const { transformsOn, updatePositions, containerRef, positionRef } = useTransformTransition()

    useLayoutEffect(() => {
        // TO DO - after updating the positions - somehow clear the oldPositions prop
        // maybe be using a stateful copy for the render
        updatePositions()
    }, [oldPositions, updatePositions]);

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
                        key={index}
                        style={getInlineTransition(transitionDuration, transformsOn, oldPlace === -1, wasAt, nowAt)}
                    >
                        {represent(item, index)}
                    </div>
                );
            })}
        </div>
    );
};