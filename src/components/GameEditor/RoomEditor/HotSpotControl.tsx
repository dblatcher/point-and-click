/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from "preact";
import { ClickEffect } from "./ClickEffect";
import { HotspotZone } from "src";
import { IdentInput, OptionalNumberInput, ParallaxInput } from "../formControls";
import { ShapeChangeFunction, ShapeControl, ValidShapeType } from "./ShapeControl";
import { eventToNumber, eventToString } from "../../../lib/util";
import styles from '../editorStyles.module.css';


interface Props {
    hotspot: HotspotZone;
    index: number;
    change: ShapeChangeFunction;
    remove: { (index: number, type: ValidShapeType): void };
    setClickEffect: { (clickEffect: ClickEffect): void };
}

export function HotspotControl({ hotspot, index, change, remove, setClickEffect }: Props) {
    const { parallax, type, walkToX, walkToY } = hotspot

    return (
        <article>
            <div className={styles.rowTopLeft}>
                <div style={{ marginRight: '.5em' }}>
                    <IdentInput value={hotspot}
                        onChangeName={event => { change(index, 'name', eventToString(event), type) }}
                        onChangeStatus={event => { change(index, 'status', eventToString(event), type) }}
                        onChangeId={event => { change(index, 'id', eventToString(event).toUpperCase(), type) }}
                    />

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
                    <div>
                        <OptionalNumberInput value={walkToX} label="X: " inputHandler={value => { change(index, 'walkToX', value, type) }} />
                    </div>
                    <div>
                        <OptionalNumberInput value={walkToY} label="Y: " inputHandler={value => { change(index, 'walkToY', value, type) }} />
                    </div>
                </fieldset>
            </div>
        </article>
    )

}