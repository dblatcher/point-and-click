import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { HotspotZone } from "@/definitions";
import { Alert, Stack, Typography } from "@mui/material";
import { ClickEffect } from "../ClickEffect";
import { HotspotControl } from "./HotSpotControl";
import { NewZoneButtons } from "./NewZoneButtons";
import { ShapeChangeFunction } from "./ShapeControl";

interface Props {
    roomId: string,
    hotspots: HotspotZone[],
    openIndex?: number
    changeZone: ShapeChangeFunction
    selectHotspot: { (id?: string): void }
    removeZone: { (index: number, type: "hotspot" | "obstacle" | "walkable"): void }
    clickEffect?: ClickEffect
    setClickEffect: { (clickEffect: ClickEffect): void }
}

export const HotspotSetEditor = ({ roomId, hotspots, openIndex, changeZone, selectHotspot, removeZone, setClickEffect, clickEffect }: Props) => {

    const activeHotspot = typeof openIndex === 'number'
        ? hotspots[openIndex]
        : undefined;

    return (
        <>
            {hotspots.length === 0 ? (
                <Alert severity="info">
                    No <b>hotspots</b> for this room yet. Select a shape from the buttons above to add one.
                </Alert>
            ) : (
                <Stack>
                    <SelectInput
                        label="pick hotspot"
                        inputHandler={selectHotspot}
                        optional
                        value={activeHotspot?.id}
                        options={hotspots.map(hotspot => hotspot.id)}
                    />
                    {activeHotspot && typeof openIndex === 'number' && (
                        <HotspotControl hotspot={activeHotspot} index={openIndex}
                            roomId={roomId}
                            setClickEffect={setClickEffect}
                            change={changeZone}
                            remove={removeZone} />
                    )}
                </Stack>
            )}

            <Typography variant="overline" marginTop={4} display={'block'}>New Hotspot</Typography>
            <NewZoneButtons
                orientation="vertical"
                type="hotspot"
                clickEffect={clickEffect}
                setClickEffect={setClickEffect}
            />
        </>
    )
}