import { HotspotZone, Zone } from "@/definitions";
import { Tab, Tabs } from "@mui/material";
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
    openTab = 0,
}: Props) => {

    const validOpenTab = openTab >= zones.length ? undefined : openTab

    return (
        <Tabs value={validOpenTab} orientation="vertical" sx={{ flexShrink: 0 }}>
            {zones.map((zone, index) => (
                <Tab
                    key={index}
                    onClick={() => {
                        selectZone(type.toUpperCase(), getClickData(zone, index), false)
                    }}
                    value={index}
                    label={getZoneLabel(zone, type, index)}
                />
            ))}
        </Tabs>
    )
}