import selectADesignContent from "@/content/selectADesign.md";
import { GameDesign } from "@/definitions";
import { GameEditorDatabase, openDataBaseConnection } from "@/lib/indexed-db";
import { ImageAsset, SoundAsset } from "@/services/assets";
import { Alert, Box, Card, Grid, Snackbar, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DbGameList } from "./DbGameList ";
import { LayoutOption, layoutOptions, layouts } from "./game/layouts";
import { GameDesignPlayer } from "./GameDesignPlayer";
import { GameList } from "./GameList";
import { LayoutRadioButtons } from "./LayoutRadioButtons";
import { LoadDesignButton } from "./LoadDesignButton";
import { MarkDown } from "./MarkDown";
import { PlayerHeaderContent } from "./PlayerHeaderContent";


export const GameDesignLoader: React.FunctionComponent = () => {

    const [db, setDb] = useState<GameEditorDatabase | undefined>(undefined)
    const [design, setDesign] = useState<GameDesign | undefined>(undefined)
    const [imageAssets, setImageAssets] = useState<ImageAsset[] | undefined>(undefined)
    const [soundAssets, setSoundAssets] = useState<SoundAsset[] | undefined>(undefined)
    const [loadingSuccessMessage, setLoadingSuccessMessage] = useState<string | undefined>(undefined)
    const [loadingErrorMessage, setLoadingErrorMessage] = useState<string | undefined>(undefined)
    const [layoutOption, setLayoutOption] = useState<LayoutOption>(layoutOptions[0])

    useEffect(() => {
        let referenceToDbWithinThisHook: GameEditorDatabase | undefined = undefined
        openDataBaseConnection().then(({ db }) => {
            if (!db) {
                console.warn('no db')
            }
            referenceToDbWithinThisHook = db
            setDb(db)
        })
        return () => {
            referenceToDbWithinThisHook?.close()
        }
    }, [setDb])


    const loadGameDesign = async (design: GameDesign, imageAssets: ImageAsset[], soundAssets: SoundAsset[]) => {
        setDesign(design)
        setImageAssets(imageAssets)
        setSoundAssets(soundAssets)
        setLoadingSuccessMessage(`Game design ${design.id} loaded`)
    }

    const handleLoadFail = async (errorMessage: string) => {
        setLoadingErrorMessage(errorMessage)
    }

    const handleMessageClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setLoadingSuccessMessage(undefined)
    };

    const handleErrorMessageClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setLoadingErrorMessage(undefined)
    };

    return <>
        <PlayerHeaderContent design={design} eject={() => {
            setDesign(undefined)
            setImageAssets(undefined)
            setSoundAssets(undefined)
        }} />
        {!design && (
            <Box sx={{ overflowY: 'auto' }}>
                <Grid container spacing={2} padding={2}>
                    <Grid item xs={6} padding={2}>
                        <Card sx={{ padding: 1 }}>
                            <MarkDown content={selectADesignContent} />
                        </Card>
                    </Grid>
                    <Grid item xs={6} display={'flex'} flexDirection={'column'} justifyContent={'space-around'}>
                        <LoadDesignButton
                            onLoad={loadGameDesign}
                            onError={handleLoadFail} />
                        <LayoutRadioButtons
                            layoutOption={layoutOption}
                            setLayoutOption={setLayoutOption}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} padding={2}>
                    <Grid item xs={12} lg={6} padding={2}>
                        <Card sx={{ padding: 1 }}>
                            <Typography>Sample Games</Typography>
                            <GameList
                                onLoad={loadGameDesign}
                                onError={handleLoadFail}
                            />
                        </Card>
                    </Grid>

                    {db && (
                        <Grid item xs={12} lg={6} padding={2}>
                            <Card sx={{ padding: 1 }}>
                                <Typography>Your Game Designs</Typography>
                                <DbGameList
                                    db={db}
                                    onLoad={loadGameDesign}
                                    onError={handleLoadFail} />
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </Box>
        )}

        {design && (
            <GameDesignPlayer
                instantMode={layoutOption === 'textBased'}
                gameDesign={design}
                imageAssets={imageAssets ?? []}
                soundAssets={soundAssets ?? []}
                uiComponents={layouts[layoutOption]}
            />
        )}


        <Snackbar open={!!loadingSuccessMessage} autoHideDuration={6000} onClose={handleMessageClose}>
            <Alert onClose={handleMessageClose} severity="success" sx={{ width: '100%' }}>
                {loadingSuccessMessage}
            </Alert>
        </Snackbar>
        <Snackbar open={!!loadingErrorMessage} autoHideDuration={6000} onClose={handleErrorMessageClose}>
            <Alert onClose={handleErrorMessageClose} severity="error" sx={{ width: '100%' }}>
                {loadingErrorMessage}
            </Alert>
        </Snackbar>
    </>

}