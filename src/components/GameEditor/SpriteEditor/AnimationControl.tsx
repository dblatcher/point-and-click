/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h, Fragment } from "preact";
import { Sprite } from "../../../lib/Sprite";
import { directions } from "../../../definitions/SpriteSheet";
import { ActorData, Direction, SpriteFrame } from "src";
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
    buildActorData: { (animkey: string, dirKey: Direction): ActorData };
    deleteAll: { (): void };
    editCycle: { (animationKey: string, direction: Direction, newValue: SpriteFrame[] | undefined): void };
    selectedFrame?: SpriteFrame;
}

export const AnimationControl: FunctionalComponent<Props> = ({
    animKey, animation, defaultDirection, overrideSprite, buildActorData, deleteAll, editCycle, selectedFrame,
}: Props) => {

    const deleteDirection = (direction: Direction) => {
        return editCycle(animKey, direction, undefined)
    }

    const addDirection = (direction: Direction) => {
        return editCycle(animKey, direction, [])
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
                            data={buildActorData(animKey, dirKey)}
                        />
                        <div className={editorStyles.row} style={{ alignItems: 'flex-end', minWidth: '14rem' }}>
                            <div style={{ minWidth: '14rem' }}>
                                <ListEditor
                                    list={animation[dirKey] as SpriteFrame[]}
                                    mutateList={newlist => {
                                        return editCycle(animKey, dirKey, newlist)
                                    }}
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
                                    createItem={() => selectedFrame ? {...selectedFrame} : undefined}
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