import { HotSpotZone, SupportedZoneShape } from "../../definitions/Zone";
import { IdentInput, ParallaxInput } from "../formControls";

interface Props {
    hotSpot: HotSpotZone;
    index: number;
    change: { (index: number, propery: Exclude<keyof HotSpotZone, ('type' & SupportedZoneShape)>, newValue: any, type?: string): void }
}

export function HotSpotControl({ hotSpot, index, change }: Props) {
    const { parallax, type } = hotSpot

    return (
        <div>
            <IdentInput value={hotSpot}
                onChangeName={event => { change(index, 'name', event.target.value, type) }}
                onChangeStatus={event => { change(index, 'status', event.target.value, type) }}
                onChangeId={event => { change(index, 'id', event.target.value.toUpperCase(), type) }}
            />

            <ParallaxInput value={parallax}
                onChange={event => { change(index, 'parallax', Number(event.target.value), type) }} />
        </div>
    )

}