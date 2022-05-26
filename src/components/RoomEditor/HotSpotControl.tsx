import { HotspotZone, SupportedZoneShape } from "../../definitions/Zone";
import { IdentInput, ParallaxInput } from "../formControls";

interface Props {
    hotspot: HotspotZone;
    index: number;
    change: { (index: number, propery: Exclude<keyof HotspotZone, ('type' & SupportedZoneShape)>, newValue: any, type?: string): void }
}

export function HotspotControl({ hotspot, index, change }: Props) {
    const { parallax, type } = hotspot

    return (
        <div>
            <IdentInput value={hotspot}
                onChangeName={event => { change(index, 'name', event.target.value, type) }}
                onChangeStatus={event => { change(index, 'status', event.target.value, type) }}
                onChangeId={event => { change(index, 'id', event.target.value.toUpperCase(), type) }}
            />

            <ParallaxInput value={parallax}
                onChange={event => { change(index, 'parallax', Number(event.target.value), type) }} />
        </div>
    )

}