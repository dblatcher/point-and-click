
import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { HotspotZone, Shape, Zone, ZoneType } from "@/definitions";
import { Box, IconButton } from "@mui/material";
import { ClickPointIcon } from "../../material-icons";
import { ClickEffect } from "../ClickEffect";

interface Props {
    shape: HotspotZone | Zone;
    index: number;
    type: ZoneType;
    changeHotSpotOrZone: { (index: number, mod: Partial<Shape>): void }
    setClickEffect: { (clickEffect: ClickEffect): void };
}

export const XYControl = ({ shape, index, changeHotSpotOrZone, setClickEffect, type }: Props) => {
    const { x, y, } = shape
    return (
        <Box component={'section'} display={'flex'} flexWrap={'wrap'} paddingTop={2} gap={4}>
            <IconButton aria-label="select position"
                onClick={() => { setClickEffect({ type: 'ZONE_POSITION', index, zoneType: type }) }}
            >
                <ClickPointIcon fontSize="large" />
            </IconButton>
            <Box maxWidth={75}>
                <NumberInput notFullWidth label="X" value={x} inputHandler={x => changeHotSpotOrZone(index, { x })} />
            </Box>
            <Box maxWidth={75}>
                <NumberInput notFullWidth label="Y" value={y} inputHandler={y => changeHotSpotOrZone(index, { y })} />
            </Box>
        </Box>
    )
}