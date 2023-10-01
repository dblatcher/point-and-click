import { FunctionComponent } from "react";
import { HotspotZone, Zone } from "@/definitions";
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


export const ZoneSetEditor: FunctionComponent<Props> = ({
    type,
    zones,
    change,
    remove,
    setClickEffect,
    selectZone,
    openTab,
    clickEffect,
}: Props) => {

    const activeZone = typeof openTab === 'number'
        ? zones[openTab]
        : undefined

    return (
        <>
            <NewZoneButtons
                type={type}
                clickEffect={clickEffect}
                setClickEffect={setClickEffect}
            />
            {zones.length === 0 ? (
                <Alert severity="info">
                    No <b>{type}s</b> for this room yet. Select a shape from the buttons above to add one.
                </Alert>
            ) : (
                <Stack>
                    <ZonePicker
                        type={type}
                        zones={zones}
                        openTab={openTab}
                        selectZone={selectZone}
                    />

                    {activeZone && typeof openTab === 'number' && (
                        <ZoneControl
                            zone={activeZone}
                            index={openTab}
                            type={type}
                            setClickEffect={setClickEffect}
                            change={change}
                            remove={remove} />
                    )}
                </Stack>
            )}
        </>
    )
}