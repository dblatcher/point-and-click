/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from "preact";
import { ClickEffect } from "./ClickEffect";
import { HotspotZone } from "src";
import { IdentInput, ParallaxInput } from "../formControls";
import { ShapeControl } from "./ShapeControl";
import { eventToNumber, eventToString } from "../../../lib/util";
import styles from '../editorStyles.module.css';


type ValidType = 'hotspot' | 'obstacle' | 'walkable';

interface Props {
    hotspot: HotspotZone;
    index: number;
    change: { (index: number, propery: Exclude<keyof HotspotZone, 'type'>, newValue: unknown, type: ValidType): void };
    remove: { (index: number, type: ValidType): void };
    setClickEffect: { (clickEffect: ClickEffect): void };
}

export function HotspotControl({ hotspot, index, change, remove, setClickEffect }: Props) {
    const { parallax, type } = hotspot

    return (
        <div>
            <IdentInput value={hotspot}
                onChangeName={event => { change(index, 'name', eventToString(event), type) }}
                onChangeStatus={event => { change(index, 'status', eventToString(event), type) }}
                onChangeId={event => { change(index, 'id', eventToString(event).toUpperCase(), type) }}
            />

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
        </div>
    )

}