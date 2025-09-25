import { RoomData, ZoneType } from "@/definitions";
import { Box, Stack, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { EditorHeading } from "../EditorHeading";
import { ItemEditorHeaderControls } from "../game-item-components/ItemEditorHeaderControls";
import { DimensionControl } from "./DimensionControl";
import { RoomDescriptionControl } from "./RoomDescriptionControl";
import { ScalingControl } from "./ScalingControl";
import { BackgroundControl } from "./background/BackgroundControl";
import { ZoneFeaturesControl } from "./zones/ZoneFeatureControls";

export type RoomEditorState = {
    tabOpen: number;
};

type RoomEditorProps = {
    data: RoomData;
}

enum RoomEditorTab {
    NameAndDescription,
    BackgroundAndDimension,
    WalkableAreas,
    Obstacles,
    SpriteScaling,
    Hotspots,
}

const tabToZoneType = (tab: RoomEditorTab): ZoneType | undefined => {
    switch (tab) {
        case RoomEditorTab.NameAndDescription:
        case RoomEditorTab.BackgroundAndDimension:
        case RoomEditorTab.SpriteScaling:
            return undefined
        case RoomEditorTab.WalkableAreas:
            return 'walkable'
        case RoomEditorTab.Obstacles:
            return 'obstacle'
        case RoomEditorTab.Hotspots:
            return 'hotspot'
    }
}

export const RoomEditor = ({ data }: RoomEditorProps) => {

    const [tabOpen, setTabOpen] = useState(RoomEditorTab.NameAndDescription)
    const { id } = data
    const zoneType = tabToZoneType(tabOpen)

    return <Stack component={'article'} spacing={1} height={'100%'}>
        <EditorHeading heading="Room Editor" helpTopic="rooms" itemId={id} >
            <ItemEditorHeaderControls
                dataItem={data}
                itemType="rooms"
                itemTypeName="room"
            />
        </EditorHeading>

        <Tabs value={tabOpen}
            onChange={(_event, tabOpen) => setTabOpen(tabOpen)}
            variant="scrollable"
            scrollButtons="auto">
            <Tab label="Name and description" value={RoomEditorTab.NameAndDescription} />
            <Tab label="Background and size" value={RoomEditorTab.BackgroundAndDimension} />
            <Tab label="Walkable" value={RoomEditorTab.WalkableAreas} />
            <Tab label="Obstacles" value={RoomEditorTab.Obstacles} />
            <Tab label="Hotspots" value={RoomEditorTab.Hotspots} />
            <Tab label="Scaling" value={RoomEditorTab.SpriteScaling} />
        </Tabs>

        {tabOpen === RoomEditorTab.NameAndDescription && <RoomDescriptionControl room={data} />}
        {tabOpen === RoomEditorTab.BackgroundAndDimension && (
            <Box display={'flex'} flexWrap={'wrap'}>
                <DimensionControl room={data} />
                <BackgroundControl room={data} />
            </Box>
        )}
        {zoneType && (
            <ZoneFeaturesControl room={data} zoneType={zoneType} />
        )}
        {tabOpen === RoomEditorTab.SpriteScaling && (
            <ScalingControl roomData={data} />
        )}
    </Stack>
}
