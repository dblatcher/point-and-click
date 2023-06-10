import { ClickEffect } from "./ClickEffect";
import { Zone } from "@/definitions";
import { ShapeChangeFunction, ShapeControl, ValidShapeType } from "./ShapeControl";
import { OptionalStringInput } from "@/components/SchemaForm/OptionalStringInput";
import { BooleanInput } from "@/components/SchemaForm/BooleanInput";
import { Box, Button, Grid, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"

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
        <Grid container component={'article'}>
            <Grid item xs={6}>
                <Stack spacing={2}>
                    <OptionalStringInput
                        label="Ref: "
                        value={zone.ref}
                        inputHandler={value => change(index, 'ref', value, type)} />
                    <BooleanInput
                        label="disabled: "
                        value={!!zone.disabled}
                        inputHandler={value => change(index, 'disabled', value, type)} />

                    <Box>
                        <Button 
                            variant="contained" 
                            startIcon={<DeleteIcon />} 
                            onClick={() => { remove(index, type) }}
                            >delete
                        </Button>
                    </Box>
                </Stack>
            </Grid>
            <Grid item xs={6}>
                <ShapeControl
                    shape={zone} index={index}
                    setClickEffect={setClickEffect}
                    type={type}
                    change={change}
                    remove={remove} />
            </Grid>
        </Grid >
    )
}