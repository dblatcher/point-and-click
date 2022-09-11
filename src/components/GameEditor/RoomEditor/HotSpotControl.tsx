/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from "preact";
import { ClickEffect } from "./ClickEffect";
import { HotspotZone } from "src";
import { OptionalNumberInput, ParallaxInput, StringInput } from "../formControls";
import { ShapeChangeFunction, ShapeControl, ValidShapeType } from "./ShapeControl";
import { eventToNumber } from "../../../lib/util";
import styles from '../editorStyles.module.css';


interface Props {
    hotspot: HotspotZone;
    index: number;
    change: ShapeChangeFunction;
    remove: { (index: number, type: ValidShapeType): void };
    setClickEffect: { (clickEffect: ClickEffect): void };
}

export function HotspotControl({ hotspot, index, change, remove, setClickEffect }: Props) {
    const { parallax, type, walkToX, walkToY, id, status, name } = hotspot

    return (
        <article>
            <div className={styles.rowTopLeft}>
                <div style={{ marginRight: '.5em' }}>
                    <StringInput
                        block className={styles.row}
                        label="id" value={id}
                        inputHandler={(value) => change(index, 'id', value, type)} />
                    <StringInput
                        block className={styles.row}
                        label="name" value={name || ''}
                        inputHandler={(value) => change(index, 'name', value, type)} />
                    <StringInput
                        block className={styles.row}
                        label="status" value={status || ''}
                        inputHandler={(value) => change(index, 'status', value, type)} />
                </div>

                <fieldset>
                    <legend>shape and position</legend>
                    <div className={styles.row}>
                        <ParallaxInput value={parallax}
                            onChange={event => { change(index, 'parallax', eventToNumber(event), type) }} />
                    </div>
                    <ShapeControl
                        shape={hotspot} index={index}
                        setClickEffect={setClickEffect}
                        type='hotspot'
                        change={change}
                        remove={remove} />
                </fieldset>

                <fieldset>
                    <legend>walk to point</legend>
                    <OptionalNumberInput
                        block
                        value={walkToX} label="X: "
                        inputHandler={value => { change(index, 'walkToX', value, type) }} />
                    <OptionalNumberInput
                        block
                        value={walkToY} label="Y: "
                        inputHandler={value => { change(index, 'walkToY', value, type) }} />
                </fieldset>
            </div>
        </article>
    )

}