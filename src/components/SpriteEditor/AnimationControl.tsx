/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h, Fragment } from "preact";
import { Sprite } from "../../lib/Sprite";
import { Direction, directions, SpriteFrame } from "../../definitions/SpriteSheet";
import { ThingData } from "src/definitions/ThingData";
import { SpritePreview } from "./SpritePreview";
import { DeleteButton } from "../formControls";
import styles from '../editorStyles.module.css';
import { useState } from "preact/hooks";


interface Props {
    animKey: string;
    defaultDirection: Direction;
    animation: Partial<Record<Direction, SpriteFrame[]>>;
    overrideSprite: Sprite;
    buildThingData: { (animkey: string, dirKey: Direction): ThingData };
    deleteAll: { (): void };
    editCycle: { (animationKey: string, direction: Direction, newValue: SpriteFrame[] | undefined): void };
}

export const AnimationControl: FunctionalComponent<Props> = ({
    animKey, animation, defaultDirection, overrideSprite, buildThingData, deleteAll, editCycle
}: Props) => {

    const [frameOpen, setFrameOpen] = useState<string | undefined>(undefined)

    const deleteDirection = (direction: Direction) => {
        return editCycle(animKey, direction, undefined)
    }

    const addDirection = (direction: Direction) => {
        return editCycle(animKey, direction, [])
    }

    const directionsUsed = Object.keys(animation) as Direction[]
    const directionsNotUsed = directions.filter(_ => !directionsUsed.includes(_))

    return (<>
        <fieldset>
            <legend>{animKey}</legend>
            <ul style={{ padding: 0, }}>
                {directionsUsed.map(dirKey => (
                    <li key={dirKey} style={{ listStyle: 'none' }}>
                        <div className={styles.row}>
                            <em>{dirKey}{dirKey === defaultDirection && '(default)'}</em>
                            {dirKey !== defaultDirection && (
                                <DeleteButton noConfirmation label={''} onClick={() => { deleteDirection(dirKey) }} />
                            )}
                        </div>
                        <div className={styles.row}>

                            <div style={{ minWidth: '12rem' }}>
                                {(animation[dirKey] as SpriteFrame[]).map((frame, index) => (
                                    <div key={index}>
                                        <span>{frame.sheetId}</span>
                                        <span>[{frame.col}, {frame.row}]</span>
                                    </div>
                                ))}
                                <button onClick={() => { setFrameOpen(dirKey) }}>Add frame</button>
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
        {frameOpen && (
            <article>
                <fieldset>
                    <legend>add frame({frameOpen}) <button onClick={()=>{setFrameOpen(undefined)}}>x</button></legend>
                </fieldset>
            </article>
        )}
    </>)
}