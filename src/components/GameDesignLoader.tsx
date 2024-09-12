import selectADesignContent from "@/content/selectADesign.md";
import { GameCondition, GameDesign } from "@/definitions";
import { cloneData } from "@/lib/clone";
import { ImageAsset, SoundAsset } from "@/services/assets";
import { Alert, Card, Grid, Snackbar } from "@mui/material";
import React from "react";
import { GameDesignPlayer } from "./GameDesignPlayer";
import { GameList } from "./GameList";
import { LayoutRadioButtons } from "./LayoutRadioButtons";
import { LayoutOption, layoutOptions, layouts } from "./layouts";
import { LoadDesignButton } from "./LoadDesignButton";
import { MarkDown } from "./MarkDown";
import { PlayerHeaderContent } from "./PlayerHeaderContent";


type State = {
    design?: GameDesign
    imageAssets?: ImageAsset[]
    soundAssets?: SoundAsset[]
    timestamp: number;
    loadingSuccessMessage?: string;
    loadingErrorMessage?: string;
    layoutOption: LayoutOption;
}

export class GameDesignLoader extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props)
        this.state = {
            design: undefined,
            timestamp: Date.now(),
            loadingSuccessMessage: undefined,
            layoutOption: layoutOptions[0],
        }

        this.loadGameDesign = this.loadGameDesign.bind(this)
        this.handleMessageClose = this.handleMessageClose.bind(this)
        this.handleErrorMessageClose = this.handleErrorMessageClose.bind(this)
        this.handleLoadFail = this.handleLoadFail.bind(this)
    }

    async loadGameDesign(design: GameDesign, imageAssets: ImageAsset[], soundAssets: SoundAsset[]) {
        this.setState({
            design,
            imageAssets,
            soundAssets,
            timestamp: Date.now(),
            loadingSuccessMessage: `Game design ${design.id} loaded`,
        });
    }

    async handleLoadFail(errorMessage: string) {
        this.setState({
            loadingErrorMessage: errorMessage,
        });
    }

    getInitialGameCondition(): GameCondition | undefined {
        const loadedGameDesign = this.state?.design;
        if (loadedGameDesign) {
            return {
                ...cloneData(loadedGameDesign),
                gameNotBegun: true,
                actorOrders: {},
            };
        }
        return undefined;
    }

    handleMessageClose(event?: React.SyntheticEvent | Event, reason?: string) {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ loadingSuccessMessage: undefined })
    };

    handleErrorMessageClose(event?: React.SyntheticEvent | Event, reason?: string) {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ loadingErrorMessage: undefined })
    };

    render() {
        const { design, imageAssets = [], soundAssets = [], loadingSuccessMessage, loadingErrorMessage } = this.state

        return <div>
            <PlayerHeaderContent design={design} eject={() => {
                return this.setState({
                    design: undefined,
                    imageAssets: undefined,
                    soundAssets: undefined
                })
            }} />
            {!design && (
                <>
                    <Grid container spacing={2} padding={2}
                        justifyContent="center"
                        alignItems="center">
                        <Grid item xs={6} gap={2}>
                            <LoadDesignButton
                                onLoad={this.loadGameDesign}
                                onError={this.handleLoadFail} />
                        </Grid>
                        <Grid item xs={6} gap={2}>
                            <LayoutRadioButtons
                                layoutOption={this.state.layoutOption}
                                setLayoutOption={(layoutOption) => { this.setState({ layoutOption }) }}
                            />
                        </Grid>
                    </Grid>
                    <GameList
                        onLoad={this.loadGameDesign}
                        onError={this.handleLoadFail}
                    />
                    <Card sx={{ padding: 2, marginX: 2 }}>
                        <MarkDown content={selectADesignContent} />
                    </Card>
                </>
            )}

            {design && (
                <GameDesignPlayer
                    gameDesign={design}
                    imageAssets={imageAssets}
                    soundAssets={soundAssets}
                    uiComponents={layouts[this.state.layoutOption]}
                />
            )}


            <Snackbar open={!!loadingSuccessMessage} autoHideDuration={6000} onClose={this.handleMessageClose}>
                <Alert onClose={this.handleMessageClose} severity="success" sx={{ width: '100%' }}>
                    {loadingSuccessMessage}
                </Alert>
            </Snackbar>
            <Snackbar open={!!loadingErrorMessage} autoHideDuration={6000} onClose={this.handleErrorMessageClose}>
                <Alert onClose={this.handleErrorMessageClose} severity="error" sx={{ width: '100%' }}>
                    {loadingErrorMessage}
                </Alert>
            </Snackbar>
        </div>
    }

}