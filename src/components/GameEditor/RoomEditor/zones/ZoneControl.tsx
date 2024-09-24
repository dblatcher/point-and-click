import { BooleanInput } from "@/components/SchemaForm/BooleanInput";
import { OptionalStringInput } from "@/components/SchemaForm/OptionalStringInput";
import { Zone } from "@/definitions";
import { Stack } from "@mui/material";
import { EditorBox } from "../../EditorBox";
import { useRoomClickEffect } from "../ClickEffect";
import { ShapeControl } from "./ShapeControl";
import { XYControl } from "./XYControl";

interface Props {
    zone: Zone;
    index: number;
    type: 'obstacle' | 'walkable';
    changeZone: { (index: number, mod: Partial<Zone>): void };
}

export function ZoneControl({ zone, index, changeZone, type }: Props) {
    const { setClickEffect } = useRoomClickEffect()
    return (
        <Stack component={'article'}>
            <EditorBox>
                <OptionalStringInput
                    label="Ref: "
                    value={zone.ref}
                    inputHandler={ref => changeZone(index, { ref })} />
                <BooleanInput
                    label="disabled: "
                    value={!!zone.disabled}
                    inputHandler={disabled => changeZone(index, { disabled })} />
                <XYControl
                    shape={zone} index={index}
                    changePosition={changeZone}
                    handlePositionSelectButton={() => setClickEffect({ type: 'ZONE_POSITION', index, zoneType: type })}
                />
                <ShapeControl
                    shape={zone} index={index}
                    type={type}
                    changeHotSpotOrZone={changeZone} />
            </EditorBox>
        </Stack >
    )
}