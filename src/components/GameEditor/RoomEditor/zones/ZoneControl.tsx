import { BooleanInput } from "@/components/SchemaForm/BooleanInput";
import { OptionalStringInput } from "@/components/SchemaForm/OptionalStringInput";
import { Zone } from "@/definitions";
import { Stack } from "@mui/material";
import { EditorBox } from "../../EditorBox";
import { ClickEffect } from "../ClickEffect";
import { ShapeControl } from "./ShapeControl";

interface Props {
    zone: Zone;
    index: number;
    type: 'obstacle' | 'walkable';
    changeZone: { (index: number, mod: Partial<Zone>): void };
    setClickEffect: { (clickEffect: ClickEffect): void };
}

export function ZoneControl({ zone, index, changeZone, setClickEffect, type }: Props) {
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
                <ShapeControl
                    shape={zone} index={index}
                    setClickEffect={setClickEffect}
                    type={type}
                    changeHotSpotOrZone={changeZone} />
            </EditorBox>
        </Stack >
    )
}