import { HotspotZone, Zone } from "point-click-lib";
import { FormControl, MenuItem, Select } from "@mui/material";


interface Props {
    type: 'obstacle' | 'walkable' | 'hotspot';
    zones: (Zone | HotspotZone)[];
    activeZoneIndex?: number;
    selectZone: { (folderId: string, data?: { id: string }): void }
}

const getZoneLabel = (zone: Zone | HotspotZone, type: string, index: number) => 'id' in zone ? zone.id : zone.ref || `${type} #${index}`
const getClickData = (zone: Zone | HotspotZone, index: number) => 'id' in zone ? zone : { id: index.toString() }

const EMPTY_STRING = ''


export const ZonePicker = ({
    type,
    zones,
    selectZone,
    activeZoneIndex,
}: Props) => {
    const selectValue = typeof activeZoneIndex === 'number' ? activeZoneIndex : EMPTY_STRING;
    return (
        <FormControl sx={{ flex: 1 }}>
            <Select<number>
                variant='filled'
                value={selectValue} label={'zones'}
                onChange={(event) => {
                    const index = Number(event.target.value)
                    if (event.target.value === EMPTY_STRING) {
                        return selectZone(type.toUpperCase(), undefined)
                    }
                    const zone = zones[index]
                    selectZone(type.toUpperCase(), getClickData(zone, index))
                }}>
                <MenuItem value={EMPTY_STRING}>[none]</MenuItem>
                {zones.map((zone, index) => (
                    <MenuItem key={index} value={index} >
                        {getZoneLabel(zone, type, index)}
                    </MenuItem>
                ))}
            </Select>
        </FormControl >

    )
}