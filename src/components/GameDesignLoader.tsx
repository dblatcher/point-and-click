import { GameCondition, GameDesign } from "@/definitions";
import { cloneData } from "@/lib/clone";
import { SoundAsset, ImageAsset } from "@/services/assets";
import { Snackbar, Alert, Card, Grid, Button, Box, Radio, FormControl, FormControlLabel, FormLabel, RadioGroup } from "@mui/material";
import React from "react";
import { GameDesignPlayer } from "./GameDesignPlayer";
import { LoadDesignButton } from "./LoadDesignButton";
import selectADesignContent from "@/content/selectADesign.md";

import { MarkDown } from "./MarkDown";
import { GameList } from "./GameList";
import { materialUiComponents } from "./game-mui-ux";
import { TextBasedLayout } from "./text-based/TextBasedLayout";
import { UiComponentSet } from "./game/uiComponentSet";
import { Layout as SimpleLayout } from "./game-ui/Layout";


const layouts = {
    material: materialUiComponents,
    textBased: { GameLayoutComponent: TextBasedLayout },
    simple: { GameLayoutComponent: SimpleLayout }
} satisfies Record<string, UiComponentSet>
type LayoutOption = keyof typeof layouts;
const layoutOptions = Object.keys(layouts) as LayoutOption[]

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

            {!design && (
                <>
                    <Grid container spacing={2} padding={2}
                        justifyContent="center"
                        alignItems="center">
                        <Grid item xs={3} gap={2}>
                            <LoadDesignButton
                                onLoad={this.loadGameDesign}
                                onError={this.handleLoadFail} />
                        </Grid>
                        <Grid item xs={3} gap={2}>
                            <FormControl>
                                <FormLabel id="layout-radio-buttons-group-label">Layout</FormLabel>
                                <RadioGroup
                                    aria-labelledby="layout-radio-buttons-group-label"
                                    defaultValue={layoutOptions[0]}
                                    name="layout-radio-buttons-group"
                                    value={this.state.layoutOption}
                                    onChange={option => { this.setState({ layoutOption: option.target.value as LayoutOption }) }}
                                >
                                    {layoutOptions.map(option => (
                                        <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <Card sx={{ padding: 2 }}>
                                <MarkDown content={selectADesignContent} />
                            </Card>
                        </Grid>
                    </Grid>
                    <GameList />
                </>
            )}

            {design && (<>
                <GameDesignPlayer
                    gameDesign={design}
                    imageAssets={imageAssets}
                    soundAssets={soundAssets}
                    uiComponents={layouts[this.state.layoutOption]}
                />
                <Button onClick={() => {
                    return this.setState({
                        design: undefined,
                        imageAssets: undefined,
                        soundAssets: undefined
                    })
                }}>Eject game</Button>
            </>)}


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
        </div >
    }

}