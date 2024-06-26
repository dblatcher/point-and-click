import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { OptionalNumberInput, } from "@/components/SchemaForm/OptionalNumberInput";
import { StringInput } from "@/components/SchemaForm/StringInput";
import { HotspotZone } from "@/definitions";
import { clamp } from "@/lib/util";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Stack } from "@mui/material";
import { EditorBox } from "../../EditorBox";
import { ClickEffect } from "../ClickEffect";
import { ShapeChangeFunction, ShapeControl, ValidShapeType } from "./ShapeControl";

interface Props {
    hotspot: HotspotZone;
    index: number;
    change: ShapeChangeFunction;
    remove: { (index: number, type: ValidShapeType): void };
    setClickEffect: { (clickEffect: ClickEffect): void };
}

export function HotspotControl({ hotspot, index, change, remove, setClickEffect }: Props) {
    const { parallax, type, walkToX, walkToY, id, status, name } = hotspot

    return (
        <Stack component={'article'} spacing={0}>
            <EditorBox>
                <StringInput
                    label="id" value={id}
                    inputHandler={(value) => change(index, 'id', value, type)} />
                <StringInput
                    label="name" value={name || ''}
                    inputHandler={(value) => change(index, 'name', value, type)} />
                <StringInput
                    label="status" value={status || ''}
                    inputHandler={(value) => change(index, 'status', value, type)} />
            </EditorBox>

            <EditorBox title="shape and position">
                <Box maxWidth={100}>
                    <NumberInput value={parallax}
                        inputHandler={(value) => { change(index, 'parallax', clamp(value, 2, 0), type) }}
                        label="parallax"
                        max={2} min={0} step={.05}
                    />
                </Box>
                <ShapeControl
                    shape={hotspot} index={index}
                    setClickEffect={setClickEffect}
                    type='hotspot'
                    change={change}
                    remove={remove} />
            </EditorBox>

            <EditorBox title="walk to point">
                <OptionalNumberInput
                    value={walkToX} label="X: "
                    inputHandler={value => { change(index, 'walkToX', value, type) }} />
                <OptionalNumberInput
                    value={walkToY} label="Y: "
                    inputHandler={value => { change(index, 'walkToY', value, type) }} />
                <Button
                    variant="outlined"
                    onClick={() => { setClickEffect({ type: 'HOTSPOT_WALKTO_POINT', index }) }}
                >select point</Button>
            </EditorBox>


            <Box>
                <Button fullWidth
                    sx={{ marginTop: 1 }}
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    onClick={() => { remove(index, 'hotspot') }}
                >delete hotspot
                </Button>
            </Box>
        </Stack>
    )

}