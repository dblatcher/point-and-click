/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h, Fragment } from "preact";
import { Sprite } from "../../lib/Sprite";
import { Direction, directions, SpriteFrame } from "../../definitions/SpriteSheet";
import { ThingData } from "src/definitions/ThingData";
import { SpritePreview } from "./SpritePreview";
import { DeleteButton } from "../formControls";
import styles from '../editorStyles.module.css';
import { useState } from "preact/hooks";
import { ListEditor } from "../ListEditor";
import { cloneData } from "../../lib/clone";


interface Props {
    animKey: string;
    defaultDirection: Direction;
    animation: Partial<Record<Direction, SpriteFrame[]>>;
    overrideSprite: Sprite;
    buildThingData: { (animkey: string, dirKey: Direction): ThingData };
    deleteAll: { (): void };
    editCycle: { (animationKey: string, direction: Direction, newValue: SpriteFrame[] | undefined): void };
    selectedFrame?: SpriteFrame;
}

export const AnimationControl: FunctionalComponent<Props> = ({
    animKey, animation, defaultDirection, overrideSprite, buildThingData, deleteAll, editCycle, selectedFrame,
}: Props) => {

    const deleteDirection = (direction: Direction) => {
        return editCycle(animKey, direction, undefined)
    }

    const addDirection = (direction: Direction) => {
        return editCycle(animKey, direction, [])
    }

    const deleteFrame = (direction: Direction, index: number) => {
        const originalList = animation[direction]
        if (!originalList) { return }
        const copyOfList = cloneData(originalList)
        copyOfList.splice(index, 1)
        return editCycle(animKey, direction, copyOfList)
    }

    const insertFrame = (direction: Direction, index: number) => {
        const originalList = animation[direction]
        if (!originalList || !selectedFrame) { return }
        const copyOfList = cloneData(originalList)
        copyOfList.splice(index, 0, {
            ...selectedFrame
        })
        return editCycle(animKey, direction, copyOfList)
    }

    const directionsUsed = Object.keys(animation) as Direction[]
    const directionsNotUsed = directions.filter(_ => !directionsUsed.includes(_))

    return (<>
        <fieldset>
            <legend>{animKey}</legend>
            <ul style={{ padding: 0, display:'flex', flexWrap:'wrap', }}>
                {directionsUsed.map(dirKey => (
                    <li key={dirKey} style={{ listStyle: 'none' }}>
                        <div className={styles.row}>
                            <em>{dirKey}{dirKey === defaultDirection && '(default)'}</em>
                            {dirKey !== defaultDirection && (
                                <DeleteButton noConfirmation label={''} onClick={() => { deleteDirection(dirKey) }} />
                            )}
                        </div>
                        <div className={styles.row} style={{alignItems:'flex-end'}}>

                            <div style={{ minWidth: '12rem' }}>
                                <ListEditor
                                    list={animation[dirKey] as SpriteFrame[]}
                                    deleteItem={(frameIndex: number) => deleteFrame(dirKey, frameIndex)}
                                    describeItem={(frame) => (
                                        <div>
                                            <span>{frame.sheetId}</span>
                                            <span>[{frame.col}, {frame.row}]</span>
                                        </div>
                                    )}
                                    insertItem={(frameIndex: number) => insertFrame(dirKey, frameIndex)}
                                />

                            </div>
                            <SpritePreview
                                overrideSprite={overrideSprite}
                                data={buildThingData(animKey, dirKey)}
                            />
                        </div>
                    </li>
                ))}
            </ul>

            <hr />

            <div>
                {directionsNotUsed.map(direction => (
                    <button key={direction} onClick={() => { addDirection(direction) }}>add {direction}</button>
                ))}
            </div>
            {directionsNotUsed.length > 0 && <hr />}
            {animKey !== 'default' &&
                <DeleteButton
                    label={`Delete animation "${animKey}"`} onClick={deleteAll} />
            }
        </fieldset>
    </>)
}