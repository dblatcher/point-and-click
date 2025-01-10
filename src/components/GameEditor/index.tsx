import { AssetsProvider } from '@/context/asset-context';
import { GameDesignProvider } from '@/context/game-design-context';
import { SpritesProvider } from '@/context/sprite-context';
import { getInitalDesign } from '@/lib/game-design-logic/initial-design';
import { gameDesignReducer } from '@/lib/game-design-logic/reducer';
import { GameEditorProps } from '@/lib/game-design-logic/types';
import { GameEditorDatabase, getKeyStoreValue, openDataBaseConnection, keyStoreUpdate } from '@/lib/indexed-db';
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
        dispatchDesignUpdate({ type: 'set-db-instance', db });
        console.log(`DB opened, version ${db.version}`);
        getKeyStoreValue(db)('update-timestamp').then(timestamp => {
            const date = timestamp && new Date(timestamp);
            if (date) {
                console.log(`update last made at ${date.toLocaleDateString()},  ${date.toLocaleTimeString()}`)
            }
        })
    }, [dispatchDesignUpdate])

    useEffect(() => {
        openDataBaseConnection().then(handleDBOpen).catch(err => {
            console.error('OPEN DB FAILED!!', err)
        })
    }, [handleDBOpen])

    useEffect(() => {
        if (usePrebuiltGame) {
            populateServicesForPreBuiltGame(imageService, soundService)
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
                                update timestamep
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
                                        keyStoreUpdate(gameEditorState.db)('update-timestamp', 7).then(result => console.log({ result }))
                                    }

                                }}>set to 7</button>
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