import { FunctionComponent } from "react";
import { HotspotZone, Zone } from "@/definitions";
import { TabSet } from "@/components/GameEditor/TabSet";
import { ClickEffect } from "./ClickEffect";
import { ShapeChangeFunction, ValidShapeType } from "./ShapeControl";
import { ZoneControl } from "./ZoneControl";
import { Stack, Alert } from "@mui/material";
import { NewZoneButtons } from "./NewZoneButtons";
import { ZonePicker } from "./ZonePicker";

type EntryClickFunction = { (folderId: string, data: { id: string }, isForNew?: boolean): void }
interface Props {
    type: 'obstacle' | 'walkable';
    zones: (Zone | HotspotZone)[];
    change: ShapeChangeFunction;
    remove: { (index: number, type: ValidShapeType): void };
    setClickEffect: { (clickEffect: ClickEffect): void };
    openTab?: number;
    selectZone: EntryClickFunction
    clickEffect?: ClickEffect;
}

const getZoneLabel = (zone: Zone, type: string, index: number): string => 'id' in zone && typeof zone.id === 'string' ? zone.id : zone.ref || `${type} #${index}`

export const ZoneSetEditor: FunctionComponent<Props> = ({
    type,
    zones,
    change,
    remove,
    setClickEffect,
    selectZone,
    openTab = 0,
    clickEffect,
}: Props) => {

    return (
        <>
            {zones.length === 0 && (
                <Alert severity="info">
                    No <b>{type}s</b> for this room yet. Select a shape from the buttons below to add one.
                </Alert>
            )}

            <Stack direction={'row'}>
                <ZonePicker
                    type={type}
                    zones={zones}
                    openTab={openTab}
                    selectZone={selectZone}
                />

                <TabSet
                    openIndex={openTab}
                    tabs={
                        zones.map((obstacle, index) => {
                            return {
                                label: getZoneLabel(obstacle, type, index), content: (
                                    <ZoneControl
                                        key={index}
                                        zone={obstacle}
                                        index={index}
                                        type={type}
                                        setClickEffect={setClickEffect}
                                        change={change}
                                        remove={remove} />
                                )
                            }
                        })
                    }
                />
            </Stack>

            <NewZoneButtons
                type={type}
                clickEffect={clickEffect}
                selectZone={selectZone}
            />
        </>
    )
}