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

    return <>
        <Stack >
            <ZonePicker
                type={'hotspot'}
                zones={hotspots}
                openTab={openIndex}
                selectZone={selectZone}
            />
            <Box flexShrink={1}>
                {hotspots.length === 0 && (
                    <Alert severity="info">
                        No <b>hotspots</b> for this room yet. Select a shape from the buttons below to add one.
                    </Alert>
                )}
                <TabSet
                    openIndex={openIndex ?? 0}
                    tabs={hotspots.map((hotspot, index) => {
                        return {
                            label: hotspot.id, content: (
                                <HotspotControl hotspot={hotspot} index={index}
                                    setClickEffect={setClickEffect}
                                    change={changeZone}
                                    remove={removeZone} />
                            )
                        }
                    })} />

            </Box>
        </Stack>
        <NewZoneButtons
            type="hotspot"
            clickEffect={clickEffect}
            selectZone={selectZone} />
    </>
}