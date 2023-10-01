import { HotspotZone } from "@/definitions";
import { Alert, Stack } from "@mui/material";
import { EntryClickFunction } from "../TreeMenu";
import { ClickEffect } from "./ClickEffect";
import { HotspotControl } from "./HotSpotControl";
import { NewZoneButtons } from "./NewZoneButtons";
import { ShapeChangeFunction } from "./ShapeControl";
import { ZonePicker } from "./ZonePicker";

interface Props {
    hotspots: HotspotZone[],
    openIndex?: number
    changeZone: ShapeChangeFunction
    selectZone: EntryClickFunction
    removeZone: { (index: number, type: "hotspot" | "obstacle" | "walkable"): void }
    clickEffect?: ClickEffect
    setClickEffect: { (clickEffect: ClickEffect): void }
}

export const HotspotPicker = ({ hotspots, openIndex, changeZone, selectZone, removeZone, setClickEffect, clickEffect }: Props) => {

    const activeHotspot = typeof openIndex === 'number'
        ? hotspots[openIndex]
        : undefined;

    return (

        <>
            <NewZoneButtons
                type="hotspot"
                clickEffect={clickEffect}
                selectZone={selectZone} />
            {hotspots.length === 0 ? (
                <Alert severity="info">
                    No <b>hotspots</b> for this room yet. Select a shape from the buttons above to add one.
                </Alert>
            ) : (
                <Stack>
                    <ZonePicker
                        type={'hotspot'}
                        zones={hotspots}
                        openTab={openIndex}
                        selectZone={selectZone}
                    />
                    {activeHotspot && typeof openIndex === 'number' && (
                        <HotspotControl hotspot={activeHotspot} index={openIndex}
                            setClickEffect={setClickEffect}
                            change={changeZone}
                            remove={removeZone} />
                    )}
                </Stack>
            )}

        </>
    )
}