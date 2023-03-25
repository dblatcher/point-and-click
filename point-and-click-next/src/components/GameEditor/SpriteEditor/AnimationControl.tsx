
import { FunctionComponent} from "react";
import { Sprite } from "@/lib/Sprite";
import { directions } from "@/oldsrc/definitions/SpriteSheet";
import { ActorData, Direction, SpriteFrame } from "@/oldsrc";
import { SpritePreview } from "../SpritePreview";
import { DeleteButton } from "../formControls";
import { ListEditor } from "../ListEditor";
import { FramePreview } from "./FramePreview";
import editorStyles from '../editorStyles.module.css';
import styles from './styles.module.css';
import { icons } from "../dataEditors";


interface Props {
    animKey: string;
    defaultDirection: Direction;
    animation: Partial<Record<Direction, SpriteFrame[]>>;
    overrideSprite: Sprite;
    buildActorData: { (animkey: string, dirKey: Direction): ActorData };
    deleteAll: { (): void };
    editCycle: { (animationKey: string, direction: Direction, newValue: SpriteFrame[] | undefined): void };
    selectedFrame?: SpriteFrame;
    pickFrame: { (row: number, col: number, sheetId?: string): void };
}

export const AnimationControl: FunctionComponent<Props> = ({
    animKey, animation, defaultDirection, overrideSprite, buildActorData, deleteAll, editCycle, selectedFrame, pickFrame
}: Props) => {

    const deleteDirection = (direction: Direction) => {
        return editCycle(animKey, direction, undefined)
    }

    const addDirection = (direction: Direction) => {
        return editCycle(animKey, direction, [])
    }

    const directionsUsed = Object.keys(animation) as Direction[]
    const directionsNotUsed = directions.filter(_ => !directionsUsed.includes(_))

    return (<>
        {animKey !== 'default' &&
            <DeleteButton
                className={[editorStyles.button, editorStyles.deleteButton].join(" ")}
                label={`${icons.DELETE}Delete animation "${animKey}"`}
                onClick={deleteAll} />
        }

        <div>
            {directionsNotUsed.map(direction => (
                <button
                    className={[editorStyles.button, editorStyles.plusButton].join(" ")}
                    key={direction} onClick={() => { addDirection(direction) }}>{icons.INSERT} direction {direction}</button>
            ))}
        </div>

        <ul className={styles.animationList}>
            {directionsUsed.map(dirKey => (
                <li key={dirKey}>
                    <fieldset>
                        <legend className={editorStyles.row}>
                            <strong style={{
                                minHeight: '1.5em',
                                marginRight: dirKey !== defaultDirection ? '1em' : undefined
                            }}>
                                {dirKey}{dirKey === defaultDirection && '(default)'}
                            </strong>
                            {dirKey !== defaultDirection && (
                                <DeleteButton noConfirmation
                                    className={[editorStyles.button, editorStyles.deleteButton].join(" ")}
                                    label={`${icons.DELETE} ${dirKey}`}
                                    onClick={() => { deleteDirection(dirKey) }} />
                            )}
                        </legend>
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
                                        <button
                                            onClick={() => { pickFrame(frame.row, frame.col, frame.imageId) }}
                                            className={styles.frameBlock}>
                                            <FramePreview
                                                height={50}
                                                width={50}
                                                backgroundColor={'yellow'}
                                                frame={frame} />
                                            <div className={styles.frameBlockText}>
                                                <p>{frame.imageId}</p>
                                                <p>[{frame.col}, {frame.row}]</p>
                                            </div>
                                        </button>
                                    )}
                                    createItem={() => selectedFrame ? { ...selectedFrame } : undefined}
                                />
                            </div>
                        </div>
                    </fieldset>
                </li>
            ))}
        </ul>
    </>)
}