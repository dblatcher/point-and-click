import { RoomData } from "@/definitions";
import { Stack, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { EditorHeading } from "../EditorHeading";
import { ItemEditorHeaderControls } from "../ItemEditorHeaderControls";
import { DimensionControl } from "./DimensionControl";
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
    BackgroundAndDimension,
    ZoneFeatures,
    SpriteScaling
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

        <Tabs value={tabOpen} onChange={(event, tabOpen) => setTabOpen(tabOpen)}>
            <Tab label="Background and dimensions" value={RoomEditorTab.BackgroundAndDimension} />
            <Tab label="Zones" value={RoomEditorTab.ZoneFeatures} />
            <Tab label="Sprite Scaling" value={RoomEditorTab.SpriteScaling} />
        </Tabs>

        {tabOpen === RoomEditorTab.BackgroundAndDimension && (
            <>
                <DimensionControl room={data} />
                <BackgroundControl room={data} />
            </>
        )}

        {tabOpen === RoomEditorTab.ZoneFeatures && (
            <ZoneFeaturesControl room={data} />
        )}

        {tabOpen === RoomEditorTab.SpriteScaling && (
            <ScalingControl room={data} />
        )}
    </Stack>
}
