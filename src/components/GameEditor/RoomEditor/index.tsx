import { RoomData } from "@/definitions";
import { Stack, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { EditorHeading } from "../EditorHeading";
import { ItemEditorHeaderControls } from "../ItemEditorHeaderControls";
import { DimensionControl } from "./DimensionControl";
import { ScalingControl } from "./ScalingControl";
import { BackgroundControl } from "./background/BackgroundControl";
import { ZoneFeaturesControl } from "./zones/ZoneFeatureControls";
import { StringInput } from "@/components/SchemaForm/StringInput";
import { useGameDesign } from "@/context/game-design-context";

export type RoomEditorState = {
    tabOpen: number;
};

type RoomEditorProps = {
    data: RoomData;
}

enum RoomEditorTab {
    NameAndDescription,
    BackgroundAndDimension,
    ZoneFeatures,
    SpriteScaling
}

export const RoomEditor = ({ data }: RoomEditorProps) => {

    const [tabOpen, setTabOpen] = useState(RoomEditorTab.BackgroundAndDimension)
    const { id } = data
    const { performUpdate } = useGameDesign()

    return <Stack component={'article'} spacing={1} height={'100%'}>
        <EditorHeading heading="Room Editor" helpTopic="rooms" itemId={id} >
            <ItemEditorHeaderControls
                dataItem={data}
                itemType="rooms"
                itemTypeName="room"
            />
        </EditorHeading>

        <Tabs value={tabOpen} onChange={(event, tabOpen) => setTabOpen(tabOpen)}>
            <Tab label="Name and description" value={RoomEditorTab.NameAndDescription} />
            <Tab label="Background and dimensions" value={RoomEditorTab.BackgroundAndDimension} />
            <Tab label="Zones" value={RoomEditorTab.ZoneFeatures} />
            <Tab label="Sprite Scaling" value={RoomEditorTab.SpriteScaling} />
        </Tabs>
        {/* TO DO - nice layout */}
        {tabOpen === RoomEditorTab.NameAndDescription && (<>
            <StringInput optional
                label="room name"
                value={data.name ?? ''}
                inputHandler={(value) => {
                    performUpdate('rooms', { ...data, name: value })
                }}
            />
        </>)}
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
