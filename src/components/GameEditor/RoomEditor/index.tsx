import { RoomData } from "@/definitions";
import { Stack, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { EditorHeading } from "../EditorHeading";
import { ItemEditorHeaderControls } from "../ItemEditorHeaderControls";
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

export const RoomEditor = ({ data }: RoomEditorProps) => {

    const [tabOpen, setTabOpen] = useState(RoomEditorTab.BackgroundAndDimension)
    const { id } = data

    return <Stack component={'article'} spacing={1} height={'100%'}>
        <EditorHeading heading="Room Editor" helpTopic="rooms" itemId={id} >
            <ItemEditorHeaderControls
                dataItem={data}
                itemType="rooms"
                itemTypeName="room"
            />
        </EditorHeading>

        <Tabs value={tabOpen}
            onChange={(event, tabOpen) => setTabOpen(tabOpen)}
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
            <>
                <DimensionControl room={data} />
                <BackgroundControl room={data} />
            </>
        )}

        {tabOpen === RoomEditorTab.WalkableAreas && (
            <ZoneFeaturesControl room={data} zoneType="walkable" />
        )}

        {tabOpen === RoomEditorTab.Obstacles && (
            <ZoneFeaturesControl room={data} zoneType='obstacle' />
        )}

        {tabOpen === RoomEditorTab.SpriteScaling && (
            <ScalingControl room={data} />
        )}

        {tabOpen === RoomEditorTab.Hotspots && (
            <ZoneFeaturesControl room={data} zoneType="hotspot" />
        )}

    </Stack>
}
