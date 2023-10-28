import { BooleanInput } from "@/components/SchemaForm/BooleanInput";
import { OptionalStringInput } from "@/components/SchemaForm/OptionalStringInput";
import { Zone } from "@/definitions";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Stack } from "@mui/material";
import { EditorBox } from "../EditorBox";
import { ClickEffect } from "./ClickEffect";
import { ShapeChangeFunction, ShapeControl, ValidShapeType } from "./ShapeControl";

interface Props {
    zone: Zone;
    index: number;
    type: 'obstacle' | 'walkable';
    change: ShapeChangeFunction;
    remove: { (index: number, type: ValidShapeType): void };
    setClickEffect: { (clickEffect: ClickEffect): void };
}

export function ZoneControl({ zone, index, change, remove, setClickEffect, type }: Props) {
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
            </EditorBox>
            <EditorBox title="shape and position">
                <ShapeControl
                    shape={zone} index={index}
                    setClickEffect={setClickEffect}
                    type={type}
                    change={change}
                    remove={remove} />
            </EditorBox>

            <Box>
                <Button fullWidth
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    onClick={() => { remove(index, type) }}
                >delete {type}
                </Button>
            </Box>
        </Stack >
    )
}