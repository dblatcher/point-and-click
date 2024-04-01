import { RoomData } from "@/definitions";
import { cloneData } from "@/lib/clone";
import { Stack, Tab, Tabs } from "@mui/material";
import { Component } from "react";
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
    updateData: (data: RoomData) => void;
    deleteData: (index: number) => void;
    existingRoomIds: string[];
    data: RoomData;
}

export class RoomEditor extends Component<RoomEditorProps, RoomEditorState>{

    constructor(props: RoomEditor['props']) {
        super(props)

        this.state = {
            tabOpen: 0,
        }

    }

    render() {
        const { tabOpen } = this.state
        const { id } = this.props.data

        return <Stack component={'article'} spacing={1} height={'100%'} marginBottom={2}>
            <EditorHeading heading="Room Editor" helpTopic="rooms" itemId={id} >
                <ItemEditorHeaderControls
                    dataItem={this.props.data}
                    itemType="rooms"
                    itemTypeName="room"
                />
            </EditorHeading>

            <Tabs value={tabOpen} onChange={(event, tabOpen) => this.setState({ tabOpen })}>
                <Tab label="Background and dimensions" value={0} />
                <Tab label="Features" value={1} />
                <Tab label="Sprite Scaling" value={2} />
            </Tabs>

            {tabOpen === 0 && (
                <>
                    <DimensionControl room={this.props.data} />
                    <BackgroundControl room={this.props.data} />
                </>
            )}

            {tabOpen === 1 && (
                <ZoneFeaturesControl room={this.props.data} />
            )}

            {tabOpen === 2 && (
                <ScalingControl room={this.props.data} />
            )}
        </Stack>
    }
}
