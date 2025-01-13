import { AssetsProvider } from '@/context/asset-context';
import { GameDesignProvider } from '@/context/game-design-context';
import { SpritesProvider } from '@/context/sprite-context';
import { getInitalDesign } from '@/lib/game-design-logic/initial-design';
import { gameDesignReducer } from '@/lib/game-design-logic/reducer';
import { GameEditorProps } from '@/lib/game-design-logic/types';
import { handleImageUpdateFunction, handleSoundUpdateFunction } from '@/lib/handle-asset-functions';
import { GameEditorDatabase, openDataBaseConnection } from '@/lib/indexed-db';
import { retrieveDesignAndAssets } from '@/lib/indexed-db/complex-transactions';
import { Sprite } from '@/lib/Sprite';
import { ImageService } from '@/services/imageService';
import { populateServicesForPreBuiltGame } from '@/services/populateServices';
import { SoundService } from '@/services/soundService';
import { editorTheme } from '@/theme';
import { Box, ButtonGroup, Container, Stack, ThemeProvider } from '@mui/material';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { GameEditorSkeleton } from '../GameEditorSkeleton';
import { MainWindow } from './MainWindow';
import { SavedDesignDialogButton } from './SavedDesignDialogButton';
import { TabButtonList } from './TabButtonList';
import { TestGameDialog } from './TestGameDialog';
import { UndoAndRedoButtons } from './UndoButton';
import { ZipFileButtons } from './ZipFileButtons';


export type { GameEditorProps };

const GameEditor: React.FunctionComponent<GameEditorProps> = ({ usePrebuiltGame }) => {
    const [soundService] = useState(new SoundService())
    const [imageService] = useState(new ImageService())
    const [waitingForDesignFromDb, setWaitingforDesignFromDb] = useState(!usePrebuiltGame)

    const [gameEditorState, dispatchDesignUpdate] = useReducer(gameDesignReducer,
        {
            gameDesign: getInitalDesign(usePrebuiltGame),
            history: [],
            undoneHistory: [],
            tabOpen: 'main',
            gameItemIds: {},
        }
    )

    // when DB opens, load the quit save and populate file asset services
    const handleDBOpen = useCallback(async (db: GameEditorDatabase) => {
        if (usePrebuiltGame) {
            return
        }
        dispatchDesignUpdate({ type: 'set-db-instance', db })
        console.log(`DB opened, version ${db.version}`)

        const { design, timestamp, imageAssets, soundAssets } = await retrieveDesignAndAssets(db)(
            'quit-save',
        )

        if (!design) {
            setWaitingforDesignFromDb(false)
            return
        }

        imageService.populate(imageAssets, 'DB')
        soundService.populate(soundAssets, 'DB')
        const date = new Date(timestamp)
        console.log(`retrieved quit saved from ${date.toLocaleDateString()},  ${date.toLocaleTimeString()}`)

        dispatchDesignUpdate({ type: 'load-new', gameDesign: design })
        setWaitingforDesignFromDb(false)

    }, [dispatchDesignUpdate, usePrebuiltGame, imageService, soundService, setWaitingforDesignFromDb])

    useEffect(() => {
        openDataBaseConnection().then(handleDBOpen).catch(err => {
            console.error('OPEN DB FAILED!!', err)
            setWaitingforDesignFromDb(false)
        })
    }, [handleDBOpen, setWaitingforDesignFromDb])

    // populate assets if usePrebuiltGame
    // if not, listen to updaets from services and store in the quit save
    useEffect(() => {
        if (usePrebuiltGame) {
            populateServicesForPreBuiltGame(imageService, soundService)
        }

        const handleImageServiceUpdate = handleImageUpdateFunction(imageService, gameEditorState.db)
        const handleSoundServiceUpdate = handleSoundUpdateFunction(soundService, gameEditorState.db)
        imageService.on('update', handleImageServiceUpdate)
        soundService.on('update', handleSoundServiceUpdate)

        return () => {
            imageService.off('update', handleImageServiceUpdate)
            soundService.off('update', handleSoundServiceUpdate)
        }
    }, [usePrebuiltGame, imageService, soundService, gameEditorState.db])


    if (waitingForDesignFromDb) {
        return <GameEditorSkeleton />
    }

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
                                    <ZipFileButtons />
                                    {gameEditorState.db &&
                                        <SavedDesignDialogButton db={gameEditorState.db} />
                                    }
                                </ButtonGroup>

                                <TabButtonList />
                                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
                                    <TestGameDialog />
                                </div>
                            </Stack>

                            <Box component={'section'}
                                flex={1}
                                padding={1}
                                sx={{ overflowY: 'auto' }}
                            >
                                <MainWindow />
                            </Box>
                        </Container>
                        <div>
                            <h2>db test stuff</h2>
                            <div>
                                version:
                                {gameEditorState.db ? gameEditorState.db.version : 'no db'}
                            </div>
                        </div>
                    </SpritesProvider>
                </AssetsProvider>
            </GameDesignProvider>
        </ThemeProvider >
    )
}

export default GameEditor