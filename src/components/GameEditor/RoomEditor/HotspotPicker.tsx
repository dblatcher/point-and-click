import { TabSet } from "@/components/GameEditor/TabSet";
import { Alert, Box, Stack } from "@mui/material";
import { HotspotControl } from "./HotSpotControl";
import { NewZoneButtons } from "./NewZoneButtons";
import { ZonePicker } from "./ZonePicker";
import { HotspotZone } from "@/definitions";
import { ShapeChangeFunction } from "./ShapeControl";
import { EntryClickFunction } from "../TreeMenu";
import { ClickEffect } from "./ClickEffect";

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
            {hotspots.length === 0 ? (
                <Alert severity="info">
                    No <b>hotspots</b> for this room yet. Select a shape from the buttons below to add one.
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
            <NewZoneButtons
                type="hotspot"
                clickEffect={clickEffect}
                selectZone={selectZone} />
        </>
    )
}