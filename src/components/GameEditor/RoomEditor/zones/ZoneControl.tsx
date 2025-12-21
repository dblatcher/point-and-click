import { BooleanInput } from "@/components/SchemaForm/BooleanInput";
import { OptionalStringInput } from "@/components/SchemaForm/OptionalStringInput";
import { Zone } from "point-click-lib";
import { Divider, Stack } from "@mui/material";
import { XYControl } from "../../XYControl";
import { useRoomClickEffect } from "../ClickEffect";
import { ShapeControl } from "./ShapeControl";

interface Props {
    zone: Zone;
    index: number;
    type: 'obstacle' | 'walkable';
    changeZone: { (index: number, mod: Partial<Zone>): void };
}

export function ZoneControl({ zone, index, changeZone, type }: Props) {
    const { setClickEffect, clickEffect } = useRoomClickEffect()
    return (
        <Stack component={'article'} spacing={2} divider={<Divider />}>
            <div>
                <OptionalStringInput
                    label="Ref: "
                    value={zone.ref}
                    inputHandler={ref => changeZone(index, { ref })} />
                <BooleanInput
                    label="disabled: "
                    value={!!zone.disabled}
                    inputHandler={disabled => changeZone(index, { disabled })} />
            </div>
            <XYControl
                point={zone} index={index}
                changePosition={changeZone}
                handlePositionSelectButton={() => setClickEffect({ type: 'ZONE_POSITION', index, zoneType: type })}
                positionSelectIsActive={clickEffect?.type === 'ZONE_POSITION' && clickEffect.index === index && clickEffect.zoneType === type}
            />
            <ShapeControl
                shape={zone} index={index}
                type={type}
                changeHotSpotOrZone={changeZone} />
        </Stack >
    )
}