import { FunctionComponent } from "react";
import { HotspotZone, Zone } from "@/definitions";
import { ClickEffect } from "../ClickEffect";
import { ShapeChangeFunction, ValidShapeType } from "./ShapeControl";
import { ZoneControl } from "./ZoneControl";
import { Stack, Alert, Box, IconButton } from "@mui/material";
import { NewZoneButtons } from "./NewZoneButtons";
import { ZonePicker } from "./ZonePicker";
import { Delete } from "@mui/icons-material";
import { ButtonWithConfirm } from "../../ButtonWithConfirm";

type EntryClickFunction = { (folderId: string, data?: { id: string }): void }
interface Props {
    type: 'obstacle' | 'walkable';
    zones: (Zone | HotspotZone)[];
    change: ShapeChangeFunction;
    remove: { (index: number, type: ValidShapeType): void };
    setClickEffect: { (clickEffect: ClickEffect): void };
    activeZoneIndex?: number;
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
    activeZoneIndex,
    clickEffect,
}: Props) => {

    const activeZone = typeof activeZoneIndex === 'number'
        ? zones[activeZoneIndex]
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
                    <Box display={'flex'} alignItems={'center'}>
                        <ZonePicker
                            type={type}
                            zones={zones}
                            activeZoneIndex={activeZoneIndex}
                            selectZone={selectZone}
                        />

                        <ButtonWithConfirm label={`delete ${type}`}
                            useIconButton
                            buttonProps={{ disabled: typeof activeZoneIndex === 'undefined', color: 'warning' }}
                            icon={<Delete fontSize="large" />}
                            onClick={() => {
                                if (typeof activeZoneIndex === 'number') {
                                    remove(activeZoneIndex, type)
                                }
                            }}
                        />
                    </Box>

                    {activeZone && typeof activeZoneIndex === 'number' && (
                        <ZoneControl
                            zone={activeZone}
                            index={activeZoneIndex}
                            type={type}
                            setClickEffect={setClickEffect}
                            change={change} />
                    )}
                </Stack>
            )}
        </>
    )
}