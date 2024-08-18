import { BooleanInput } from "@/components/SchemaForm/BooleanInput";
import { OptionalStringInput } from "@/components/SchemaForm/OptionalStringInput";
import { Zone } from "@/definitions";
import { Stack } from "@mui/material";
import { EditorBox } from "../../EditorBox";
import { ClickEffect } from "../ClickEffect";
import { ShapeChangeFunction, ShapeControl } from "./ShapeControl";

interface Props {
    zone: Zone;
    index: number;
    type: 'obstacle' | 'walkable';
    change: ShapeChangeFunction;
    setClickEffect: { (clickEffect: ClickEffect): void };
}

export function ZoneControl({ zone, index, change, setClickEffect, type }: Props) {
    return (
        <Stack component={'article'}>
            <EditorBox>
                <OptionalStringInput
                    label="Ref: "
                    value={zone.ref}
                    inputHandler={value => change(index, 'ref', value, type)} />
                <BooleanInput
                    label="disabled: "
                    value={!!zone.disabled}
                    inputHandler={value => change(index, 'disabled', value, type)} />
                <ShapeControl
                    shape={zone} index={index}
                    setClickEffect={setClickEffect}
                    type={type}
                    change={change} />
            </EditorBox>
        </Stack >
    )
}