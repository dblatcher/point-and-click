import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { OptionalNumberInput, } from "@/components/SchemaForm/OptionalNumberInput";
import { StringInput } from "@/components/SchemaForm/StringInput";
import { HotspotZone } from "@/definitions";
import { clamp } from "@/lib/util";
import { ClickPointIcon, DeleteIcon } from "@/components/GameEditor/material-icons";
import { Box, Button, ButtonGroup, IconButton } from "@mui/material";
import { AccoridanedContent } from "../../AccordianedContent";
import { ButtonWithConfirm } from "../../ButtonWithConfirm";
import { InteractionsDialogsButton } from "../../InteractionsDialogsButton";
import { ClickEffect } from "../ClickEffect";
import { ShapeChangeFunction, ShapeControl, ValidShapeType } from "./ShapeControl";

interface Props {
    roomId: string;
    hotspot: HotspotZone;
    index: number;
    change: ShapeChangeFunction;
    remove: { (index: number, type: ValidShapeType): void };
    setClickEffect: { (clickEffect: ClickEffect): void };
}

export function HotspotControl({ roomId, hotspot, index, change, remove, setClickEffect }: Props) {
    const { parallax, type, walkToX, walkToY, id, status, name } = hotspot

    return (
        <Box component={'article'}>
            <AccoridanedContent tabs={[
                {
                    label: 'hotspot',
                    content: <>
                        <StringInput
                            label="id" value={id}
                            inputHandler={(value) => change(index, 'id', value, type)} />
                        <StringInput
                            label="name" value={name || ''}
                            inputHandler={(value) => change(index, 'name', value, type)} />
                        <StringInput
                            label="status" value={status || ''}
                            inputHandler={(value) => change(index, 'status', value, type)} />
                        <ButtonGroup>
                            <InteractionsDialogsButton
                                criteria={interaction => interaction.targetId === id && (!interaction.roomId || interaction.roomId === roomId)}
                                newPartial={{ roomId, targetId: id }}
                            />
                            <ButtonWithConfirm
                                label="Delete Hotspot"
                                onClick={() => { remove(index, 'hotspot') }}
                                confirmationText={`Delete hotspot "${hotspot.id}"`}
                                buttonProps={{
                                    variant: "outlined",
                                    color: 'warning',
                                    startIcon: <DeleteIcon />
                                }}
                            />
                        </ButtonGroup>
                    </>
                },
                {
                    label: 'walk to point', content: (
                        <Box display={'flex'} flexWrap={'wrap'}>
                            <Box>
                                <OptionalNumberInput
                                    value={walkToX} label="X: "
                                    inputHandler={value => { change(index, 'walkToX', value, type) }} />
                            </Box>
                            <Box>
                                <OptionalNumberInput
                                    value={walkToY} label="Y: "
                                    inputHandler={value => { change(index, 'walkToY', value, type) }} />

                            </Box>
                            <IconButton aria-label="select walk to point"
                                onClick={() => { setClickEffect({ type: 'HOTSPOT_WALKTO_POINT', index }) }}
                            >
                                <ClickPointIcon fontSize="large" />
                            </IconButton>
                        </Box>
                    )
                },
                {
                    label: 'shape and position', content: <>
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
                    </>
                },
            ]} />
        </Box>
    )
}