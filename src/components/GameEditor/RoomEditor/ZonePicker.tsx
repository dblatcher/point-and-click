import { HotspotZone, Zone } from "@/definitions";
import { FormControl, MenuItem, Select } from "@mui/material";
import { FunctionComponent } from "react";


type EntryClickFunction = { (folderId: string, data: { id: string }, isForNew?: boolean): void }
interface Props {
    type: 'obstacle' | 'walkable' | 'hotspot';
    zones: (Zone | HotspotZone)[];
    openTab?: number;
    selectZone: EntryClickFunction
}

const getZoneLabel = (zone: Zone | HotspotZone, type: string, index: number) => 'id' in zone ? zone.id : zone.ref || `${type} #${index}`
const getClickData = (zone: Zone | HotspotZone, index: number) => 'id' in zone ? zone : { id: index.toString() }

export const ZonePicker: FunctionComponent<Props> = ({
    type,
    zones,
    selectZone,
    openTab,
}: Props) => {

    return (
        <FormControl>
            <Select<number>
                variant='filled'
                value={openTab} label={'zones'}
                onChange={(event) => {
                    const index = Number(event.target.value)
                    const zone = zones[index]
                    selectZone(type.toUpperCase(), getClickData(zone, index), false)
                }}>
                <MenuItem value={undefined}>[none]</MenuItem>
                {zones.map((zone, index) => (
                    <MenuItem key={index} value={index} >
                        {getZoneLabel(zone, type, index)}
                    </MenuItem>
                ))}
            </Select>
        </FormControl >

    )
}