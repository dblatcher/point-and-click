import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { StringInput } from "@/components/SchemaForm/StringInput";
import { HotspotZone } from "@/definitions";
import { clamp } from "@/lib/util";
import { Box, ButtonGroup, Divider } from "@mui/material";
import { InteractionsDialogsButton } from "../../InteractionsDialogsButton";
import { useRoomClickEffect } from "../ClickEffect";
import { ShapeControl } from "./ShapeControl";
import { WalkToControl, XYControl } from "./XYControl";

interface Props {
    roomId: string;
    hotspot: HotspotZone;
    index: number;
    changeHotspot: { (index: number, mod: Partial<HotspotZone>): void }
}

export function HotspotControl({ roomId, hotspot, index, changeHotspot }: Props) {
    const { setClickEffect, clickEffect } = useRoomClickEffect()
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
            <XYControl point={hotspot} index={index}
                changePosition={(index, mod) => changeHotspot(index, mod)}
                handlePositionSelectButton={() => setClickEffect({ type: 'ZONE_POSITION', index, zoneType: 'hotspot' })}
                positionSelectIsActive={clickEffect?.type === 'ZONE_POSITION' && clickEffect.index === index && clickEffect.zoneType === 'hotspot'}
            />
            <WalkToControl point={hotspot} index={index}
                changePosition={(index, mod) => changeHotspot(index, mod)}
                handlePositionSelectButton={() => { setClickEffect({ type: 'HOTSPOT_WALKTO_POINT', index }) }}
                positionSelectIsActive={clickEffect?.type === 'HOTSPOT_WALKTO_POINT' && clickEffect.index === index}
            />
            <ShapeControl
                shape={hotspot} index={index}
                type='hotspot'
                changeHotSpotOrZone={(index, mod) => changeHotspot(index, mod as Partial<HotspotZone>)}
            />
        </Box>
    )
}