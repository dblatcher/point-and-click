import { ClickPointIcon } from "@/components/GameEditor/material-icons";
import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { OptionalNumberInput, } from "@/components/SchemaForm/OptionalNumberInput";
import { StringInput } from "@/components/SchemaForm/StringInput";
import { HotspotZone } from "@/definitions";
import { clamp } from "@/lib/util";
import { Box, ButtonGroup, Divider, IconButton } from "@mui/material";
import { InteractionsDialogsButton } from "../../InteractionsDialogsButton";
import { ClickEffect } from "../ClickEffect";
import { ShapeControl } from "./ShapeControl";
import { XYControl } from "./XYControl";

interface Props {
    roomId: string;
    hotspot: HotspotZone;
    index: number;
    changeHotspot: { (index: number, mod: Partial<HotspotZone>): void }
    setClickEffect: { (clickEffect: ClickEffect): void };
}

export function HotspotControl({ roomId, hotspot, index, setClickEffect, changeHotspot }: Props) {
    const { parallax, walkToX, walkToY, id, status, name } = hotspot

    return (
        <Box component={'article'}>
            <Box display={'flex'} gap={2}>
                <Box component={'section'}>
                    <StringInput
                        label="id" value={id}
                        inputHandler={(id) => changeHotspot(index, { id })} />
                    <StringInput
                        label="name" value={name || ''}
                        inputHandler={(name) => changeHotspot(index, { name })} />
                    <StringInput
                        label="status" value={status || ''}
                        inputHandler={(status) => changeHotspot(index, { status })} />
                </Box>
                <Divider flexItem orientation="vertical" />
                <Box component={'section'} minWidth={200}>
                    <div>
                        <NumberInput value={parallax}
                            inputHandler={(value) => changeHotspot(index, { parallax: clamp(value, 2, 0) })}
                            label="parallax"
                            max={2} min={0} step={.05}
                        />
                    </div>
                    <ButtonGroup>
                        <InteractionsDialogsButton
                            criteria={interaction => interaction.targetId === id && (!interaction.roomId || interaction.roomId === roomId)}
                            newPartial={{ roomId, targetId: id }}
                        />
                    </ButtonGroup>
                </Box>
            </Box>
            <Divider />
            <XYControl
                shape={hotspot} index={index}
                setClickEffect={setClickEffect}
                type='hotspot'
                changeHotSpotOrZone={(index, mod) => changeHotspot(index, mod as Partial<HotspotZone>)}
            />
            <Box component={'section'} display={'flex'} flexWrap={'wrap'} paddingTop={2}>
                <IconButton aria-label="select walk to point"
                    onClick={() => { setClickEffect({ type: 'HOTSPOT_WALKTO_POINT', index }) }}
                >
                    <ClickPointIcon fontSize="large" />
                </IconButton>
                <Box>
                    <OptionalNumberInput
                        value={walkToX} label="walk-to X: "
                        inputHandler={walkToX => changeHotspot(index, { walkToX })} />
                </Box>
                <Box>
                    <OptionalNumberInput
                        value={walkToY} label="walk-to Y: "
                        inputHandler={walkToY => changeHotspot(index, { walkToY })} />
                </Box>
            </Box>

            <ShapeControl
                shape={hotspot} index={index}
                setClickEffect={setClickEffect}
                type='hotspot'
                changeHotSpotOrZone={(index, mod) => changeHotspot(index, mod as Partial<HotspotZone>)}
            />
        </Box>
    )
}