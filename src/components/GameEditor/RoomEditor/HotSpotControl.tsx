import { ClickEffect } from "./ClickEffect";
import { HotspotZone } from "../../..";
import { OptionalNumberInput, ParallaxInput, StringInput } from "../formControls";
import { ShapeChangeFunction, ShapeControl, ValidShapeType } from "./ShapeControl";
import editorStyles from '../editorStyles.module.css';


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
            <div className={editorStyles.rowTopLeft}>
                <div style={{ marginRight: '.5em' }}>
                    <StringInput
                        block className={editorStyles.row}
                        label="id" value={id}
                        inputHandler={(value) => change(index, 'id', value, type)} />
                    <StringInput
                        block className={editorStyles.row}
                        label="name" value={name || ''}
                        inputHandler={(value) => change(index, 'name', value, type)} />
                    <StringInput
                        block className={editorStyles.row}
                        label="status" value={status || ''}
                        inputHandler={(value) => change(index, 'status', value, type)} />

                    <button onClick={() => { remove(index, 'hotspot') }}>delete</button>
                </div>

                <fieldset>
                    <legend>shape and position</legend>
                    <div className={editorStyles.row}>
                        <ParallaxInput value={parallax}
                            inputHandler={value => { change(index, 'parallax', value, type) }} />
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
                    <button onClick={() => { setClickEffect({ type: 'HOTSPOT_WALKTO_POINT', index }) }}>select point</button>
                </fieldset>
            </div>
        </article>
    )

}