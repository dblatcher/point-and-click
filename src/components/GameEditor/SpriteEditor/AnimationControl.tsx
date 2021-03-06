/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h, Fragment } from "preact";
import { Sprite } from "../../../lib/Sprite";
import { Direction, directions, SpriteFrame } from "../../../definitions/SpriteSheet";
import { CharacterData } from "src/definitions/CharacterData";
import { SpritePreview } from "../SpritePreview";
import { DeleteButton } from "../formControls";
import { ListEditor } from "../ListEditor";
import { cloneData } from "../../../lib/clone";
import { FramePreview } from "./FramePreview";
import editorStyles from '../editorStyles.module.css';
import styles from './styles.module.css';


interface Props {
    animKey: string;
    defaultDirection: Direction;
    animation: Partial<Record<Direction, SpriteFrame[]>>;
    overrideSprite: Sprite;
    buildCharacterData: { (animkey: string, dirKey: Direction): CharacterData };
    deleteAll: { (): void };
    editCycle: { (animationKey: string, direction: Direction, newValue: SpriteFrame[] | undefined): void };
    selectedFrame?: SpriteFrame;
}

export const AnimationControl: FunctionalComponent<Props> = ({
    animKey, animation, defaultDirection, overrideSprite, buildCharacterData, deleteAll, editCycle, selectedFrame,
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
            <ul className={styles.animationList}>
                {directionsUsed.map(dirKey => (
                    <li key={dirKey}>
                        <div className={editorStyles.row}>
                            <em>{dirKey}{dirKey === defaultDirection && '(default)'}</em>
                            {dirKey !== defaultDirection && (
                                <DeleteButton noConfirmation label={''} onClick={() => { deleteDirection(dirKey) }} />
                            )}
                        </div>
                        <SpritePreview
                            overrideSprite={overrideSprite}
                            data={buildCharacterData(animKey, dirKey)}
                        />
                        <div className={editorStyles.row} style={{ alignItems: 'flex-end', minWidth: '14rem' }}>
                            <div style={{ minWidth: '14rem' }}>
                                <ListEditor
                                    list={animation[dirKey] as SpriteFrame[]}
                                    deleteItem={(frameIndex: number) => deleteFrame(dirKey, frameIndex)}
                                    describeItem={(frame) => (
                                        <div className={styles.frameBlock}>
                                            <FramePreview
                                                height={50}
                                                width={50}
                                                backgroundColor={'yellow'}
                                                frame={frame} />
                                            <div className={styles.frameBlockText}>
                                                <p>{frame.sheetId}</p>
                                                <p>[{frame.col}, {frame.row}]</p>
                                            </div>
                                        </div>
                                    )}
                                    insertItem={(frameIndex: number) => insertFrame(dirKey, frameIndex)}
                                />
                            </div>
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