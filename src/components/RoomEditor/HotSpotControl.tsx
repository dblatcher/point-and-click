import { h } from "preact";
import { ClickEffect } from "./ClickEffect";
import { HotspotZone, SupportedZoneShape } from "../../definitions/Zone";
import { IdentInput, ParallaxInput } from "../formControls";
import { ZoneControl } from "./ZoneControl";
import styles from './styles.module.css';

interface Props {
    hotspot: HotspotZone;
    index: number;
    change: { (index: number, propery: Exclude<keyof HotspotZone, ('type' & SupportedZoneShape)>, newValue: any, type?: string): void }
    remove: { (index: number, type?: string): void };
    move: { (index: number, x: number, y: number, type?: string): void };
    setClickEffect: { (clickEffect: ClickEffect): void }
}

export function HotspotControl({ hotspot, index, change, move, remove, setClickEffect }: Props) {
    const { parallax, type } = hotspot

    return (
        <div>
            <IdentInput value={hotspot}
                onChangeName={event => { change(index, 'name', event.target.value, type) }}
                onChangeStatus={event => { change(index, 'status', event.target.value, type) }}
                onChangeId={event => { change(index, 'id', event.target.value.toUpperCase(), type) }}
            />

            <div className={styles.row}>
                <ParallaxInput value={parallax}
                    onChange={event => { change(index, 'parallax', Number(event.target.value), type) }} />
            </div>

            <ZoneControl
                zone={hotspot} index={index}
                setClickEffect={setClickEffect}
                move={move}
                change={change}
                remove={remove} />
        </div>
    )

}