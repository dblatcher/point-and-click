import { HotspotZone, Zone, ZoneType } from "@/definitions";
import { Delete } from "@mui/icons-material";
import { Alert, Box, Stack } from "@mui/material";
import { FunctionComponent } from "react";
import { ButtonWithConfirm } from "../../ButtonWithConfirm";
import { NewZoneButtons } from "./NewZoneButtons";
import { ZoneControl } from "./ZoneControl";
import { ZonePicker } from "./ZonePicker";

type EntryClickFunction = { (folderId: string, data?: { id: string }): void }
interface Props {
    type: 'obstacle' | 'walkable';
    zones: (Zone | HotspotZone)[];
    changeZone: { (index: number, mod: Partial<Zone>): void };
    remove: { (index: number, type: ZoneType): void };
    activeZoneIndex?: number;
    selectZone: EntryClickFunction
}


export const ZoneSetEditor: FunctionComponent<Props> = ({
    type,
    zones,
    changeZone,
    remove,
    selectZone,
    activeZoneIndex,
}: Props) => {

    const activeZone = typeof activeZoneIndex === 'number'
        ? zones[activeZoneIndex]
        : undefined

    return (
        <>
            <NewZoneButtons type={type} />
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
                            changeZone={changeZone} />
                    )}
                </Stack>
            )}
        </>
    )
}