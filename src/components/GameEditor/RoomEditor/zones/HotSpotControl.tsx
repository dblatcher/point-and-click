import { ClickPointIcon } from "@/components/GameEditor/material-icons";
import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { OptionalNumberInput, } from "@/components/SchemaForm/OptionalNumberInput";
import { StringInput } from "@/components/SchemaForm/StringInput";
import { HotspotZone } from "@/definitions";
import { clamp } from "@/lib/util";
import { Box, ButtonGroup, IconButton } from "@mui/material";
import { AccoridanedContent } from "../../AccordianedContent";
import { InteractionsDialogsButton } from "../../InteractionsDialogsButton";
import { ClickEffect } from "../ClickEffect";
import { ShapeChangeFunction, ShapeControl } from "./ShapeControl";

interface Props {
    roomId: string;
    hotspot: HotspotZone;
    index: number;
    change: ShapeChangeFunction;
    setClickEffect: { (clickEffect: ClickEffect): void };
}

export function HotspotControl({ roomId, hotspot, index, change, setClickEffect }: Props) {
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
                        </ButtonGroup>
                    </>
                },
                {
                    label: 'walk to point', content: (
                        <Box display={'flex'} flexWrap={'wrap'}>
                            <Box maxWidth={300}>
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
                            change={change} />
                    </>
                },
            ]} />
        </Box>
    )
}