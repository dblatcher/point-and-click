import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { HotspotZone } from "@/definitions";
import { Delete } from "@mui/icons-material";
import { Alert, Box, Divider, Stack } from "@mui/material";
import { ButtonWithConfirm } from "../../ButtonWithConfirm";
import { HotspotControl } from "./HotSpotControl";
import { NewZoneButtons } from "./NewZoneButtons";

interface Props {
    roomId: string,
    hotspots: HotspotZone[],
    openIndex?: number
    changeHotspot: { (index: number, mod: Partial<HotspotZone>): void }
    selectHotspot: { (id?: string): void }
    removeZone: { (index: number, type: "hotspot" | "obstacle" | "walkable"): void }
}

export const HotspotSetEditor = ({ roomId, hotspots, openIndex, selectHotspot, removeZone, changeHotspot }: Props) => {

    const activeHotspot = typeof openIndex === 'number'
        ? hotspots[openIndex]
        : undefined;

    return (
        <>
            <NewZoneButtons type="hotspot" />
            {hotspots.length === 0 ? (
                <Alert severity="info">
                    No <b>hotspots</b> for this room yet. Select a shape from the buttons above to add one.
                </Alert>
            ) : (
                <Stack spacing={4} divider={<Divider />}>
                    <Box display={'flex'} alignItems={'center'}>
                        <SelectInput
                            label="pick hotspot"
                            inputHandler={selectHotspot}
                            optional
                            value={activeHotspot?.id}
                            options={hotspots.map(hotspot => hotspot.id)}
                        />
                        <ButtonWithConfirm label={`delete hotspot`}
                            useIconButton
                            buttonProps={{ disabled: typeof openIndex === 'undefined', color: 'warning' }}
                            icon={<Delete fontSize="large" />}
                            onClick={() => {
                                if (typeof openIndex === 'number') {
                                    removeZone(openIndex, 'hotspot')
                                }
                            }}
                        />
                    </Box>

                    {activeHotspot && typeof openIndex === 'number' && (
                        <HotspotControl hotspot={activeHotspot} index={openIndex}
                            roomId={roomId}
                            changeHotspot={changeHotspot}
                        />
                    )}
                </Stack>
            )}
        </>
    )
}