/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from "preact";
import { ClickEffect } from "./ClickEffect";
import { Zone } from "src";
import { ShapeChangeFunction, ShapeControl, ValidShapeType } from "./ShapeControl";
import { CheckBoxInput, OptionalStringInput } from "../formControls";
import styles from '../editorStyles.module.css';

interface Props {
    zone: Zone;
    index: number;
    type: 'obstacle' | 'walkable';
    change: ShapeChangeFunction;
    remove: { (index: number, type: ValidShapeType): void };
    setClickEffect: { (clickEffect: ClickEffect): void };
}

export function ZoneControl({ zone, index, change, remove, setClickEffect, type }: Props) {
    return (
        <article>
            <div className={styles.rowTopLeft}>
                <div style={{ marginRight: '.5em' }}>
                    <div>
                        <OptionalStringInput
                            label="Ref: "
                            value={zone.ref}
                            inputHandler={value => change(index, 'ref', value, type)} />
                    </div>
                    <div>
                        <CheckBoxInput
                            label="disabled: "
                            value={zone.disabled}
                            inputHandler={value => change(index, 'disabled', value, type)} />
                    </div>
                </div>
                <ShapeControl
                    shape={zone} index={index}
                    setClickEffect={setClickEffect}
                    type={type}
                    change={change}
                    remove={remove} />
            </div>
        </article >
    )
}