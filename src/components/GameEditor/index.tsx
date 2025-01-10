import { AssetsProvider } from '@/context/asset-context';
import { GameDesignProvider } from '@/context/game-design-context';
import { SpritesProvider } from '@/context/sprite-context';
import { getInitalDesign } from '@/lib/game-design-logic/initial-design';
import { gameDesignReducer } from '@/lib/game-design-logic/reducer';
import { GameEditorProps } from '@/lib/game-design-logic/types';
import { GameEditorDatabase, getKeyStoreValue, openDataBaseConnection, keyStoreUpdate, retrieveQuitSave } from '@/lib/indexed-db';
import { Sprite } from '@/lib/Sprite';
import { ImageService } from '@/services/imageService';
import { populateServicesForPreBuiltGame } from '@/services/populateServices';
import { SoundService } from '@/services/soundService';
import { editorTheme } from '@/theme';
import { Box, ButtonGroup, Container, Stack, ThemeProvider } from '@mui/material';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { MainWindow } from './MainWindow';
import { SaveAndLoadButtons } from './SaveAndLoadButtons';
import { TabButtonList } from './TabButtonList';
import { TestGameDialog } from './TestGameDialog';
import { UndoAndRedoButtons } from './UndoButton';
import { AssetServiceUpdate } from '@/services/FileAssetService';


export type { GameEditorProps };


const GameEditor: React.FunctionComponent<GameEditorProps> = ({ usePrebuiltGame }) => {

    const [soundService] = useState(new SoundService())
    const [imageService] = useState(new ImageService())
    const [gameEditorState, dispatchDesignUpdate] = useReducer(gameDesignReducer,
        {
            gameDesign: getInitalDesign(usePrebuiltGame),
            history: [],
            undoneHistory: [],
            tabOpen: 'main',
            gameItemIds: {},
        }
    )

    const handleDBOpen = useCallback((db: GameEditorDatabase) => {
        if (usePrebuiltGame) {
            return
        }
        dispatchDesignUpdate({ type: 'set-db-instance', db });
        console.log(`DB opened, version ${db.version}`);

        // TO DO - need to also store and retrieve the file assets
        // and populate the services.
        // Could subscribe to the update events from the services
        // and store assets then.
        // need a good structure to avoid unnecessary transactions
        // - only save the modified assets (change the update events!)
        retrieveQuitSave(db)().then(({ design, timestamp = 0 }) => {
            if (design) {
                const date = new Date(timestamp);
                console.log(`restoring design last made at ${date.toLocaleDateString()},  ${date.toLocaleTimeString()}`)
                dispatchDesignUpdate({ type: 'load-new', gameDesign: design })
            }

        })
    }, [dispatchDesignUpdate, usePrebuiltGame])

    useEffect(() => {
        openDataBaseConnection().then(handleDBOpen).catch(err => {
            console.error('OPEN DB FAILED!!', err)
        })
    }, [handleDBOpen])

    useEffect(() => {
        if (usePrebuiltGame) {
            populateServicesForPreBuiltGame(imageService, soundService)
        }

        // TO DO - if updates are add or remove, save the changes to
        // the db asset collection for quit save
        const handleImageServiceUpdate = (update: AssetServiceUpdate) => {
            console.log('an image update', update)
        }
        const handleSoundServiceUpdate = (update: AssetServiceUpdate) => {
            console.log('an sound update', update)
        }

        imageService.on('update', handleImageServiceUpdate)
        soundService.on('update', handleSoundServiceUpdate)

        return () => { 
            imageService.off('update', handleImageServiceUpdate) 
            soundService.off('update', handleSoundServiceUpdate) 
        }

    }, [usePrebuiltGame, imageService, soundService])


    const { gameDesign, history, undoneHistory } = gameEditorState
    const sprites = [...gameDesign.sprites.map(data => new Sprite(data, imageService.get.bind(imageService)))]

    return (
        <ThemeProvider theme={editorTheme}>
            <GameDesignProvider input={
                {
                    gameDesign: gameEditorState.gameDesign,
                    tabOpen: gameEditorState.tabOpen,
                    gameItemIds: gameEditorState.gameItemIds,
                    dispatchDesignUpdate,
                }
            }>
                <AssetsProvider soundService={soundService} imageService={imageService}>
                    <SpritesProvider value={sprites}>
                        <div>
                            <h2>db test stuff</h2>
                            <div>
                                version:
                                {gameEditorState.db ? gameEditorState.db.version : 'no db'}
                            </div>
                            <div>
                                update test timestamp value
                                <button onClick={() => {
                                    if (gameEditorState.db) {
                                        getKeyStoreValue(gameEditorState.db)('update-timestamp').then(result => console.log({ result }))
                                    }
                                }}>get</button>
                                <button onClick={() => {
                                    if (gameEditorState.db) {
                                        keyStoreUpdate(gameEditorState.db)('update-timestamp', 42).then(result => console.log({ result }))
                                    }
                                }}>set to 42</button>
                                <button onClick={() => {
                                    if (gameEditorState.db) {
                                        keyStoreUpdate(gameEditorState.db)('update-timestamp', Date.now()).then(result => console.log({ result }))
                                    }
                                }}>set to now</button>
                            </div>
                        </div>
                        <Container component={'main'}
                            maxWidth='xl'
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                overflow: 'hidden',
                                flex: 1,
                                gap: 5,
                                background: 'white',
                            }}>

                            <Stack component={'nav'}
                                spacing={1}
                                width={150}
                            >
                                <ButtonGroup sx={{ marginTop: 3 }} orientation="horizontal" >
                                    <UndoAndRedoButtons history={history} undoneHistory={undoneHistory} />
                                    <SaveAndLoadButtons />
                                    <TestGameDialog />
                                </ButtonGroup>

                                <TabButtonList />
                            </Stack>

                            <Box component={'section'}
                                flex={1}
                                padding={1}
                                sx={{ overflowY: 'auto' }}
                            >
                                <MainWindow />
                            </Box>
                        </Container>
                    </SpritesProvider>
                </AssetsProvider>
            </GameDesignProvider>
        </ThemeProvider >
    )
}

export default GameEditor