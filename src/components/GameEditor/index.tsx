import { AssetsProvider } from '@/context/asset-context';
import { GameDesignProvider } from '@/context/game-design-context';
import { SpritesProvider } from '@/context/sprite-context';
import { getInitalDesign } from '@/lib/game-design-logic/initial-design';
import { gameDesignReducer } from '@/lib/game-design-logic/reducer';
import { GameEditorProps } from '@/lib/game-design-logic/types';
import { handleImageUpdateFunction, handleSoundUpdateFunction } from '@/lib/handle-asset-functions';
import { MaybeDesignAndAssets, GameEditorDatabase, openDataBaseConnection, SavedDesignKey } from '@/lib/indexed-db';
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
import { parseAndUpgrade } from '@/lib/design-version-management';


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

    const handleIncomingDesign = useCallback((sourceIdentifier: string, designAndAssets: MaybeDesignAndAssets): boolean => {
        const { design, timestamp, imageAssets, soundAssets } = designAndAssets;

        if (!design) {
            console.log(`no design ${sourceIdentifier} found`);
            setWaitingforDesignFromDb(false)
            return false
        }

        // TO DO - handle time formats for undefined
        const date = new Date(timestamp ?? 0);
        console.log(`retrieved ${sourceIdentifier} from ${date.toLocaleDateString()},  ${date.toLocaleTimeString()}`)

        const { gameDesign, failureMessage, updated, sourceVersion } = parseAndUpgrade(design);

        if (!gameDesign) {
            alert(`Could not parse ${sourceIdentifier}: ${failureMessage ?? 'UNKNOWN'}`);
            setWaitingforDesignFromDb(false);
            return false
        }
        if (updated) {
            console.log(`Updated from version ${sourceVersion}`);
        }
        imageService.populate(imageAssets, 'DB')
        soundService.populate(soundAssets, 'DB')
        dispatchDesignUpdate({ type: 'load-new', gameDesign })
        setWaitingforDesignFromDb(false)
        return true
    }, [imageService, soundService])

    // when DB opens, load the quit save and populate file asset services
    const handleDBOpen = useCallback(async ({ db }: { db: GameEditorDatabase }) => {
        if (usePrebuiltGame) {
            return
        }
        dispatchDesignUpdate({ type: 'set-db-instance', db })
        console.log(`DB opened, version ${db.version}`)

        const designAndAssets = await retrieveDesignAndAssets(db)('quit-save')
        handleIncomingDesign('quit-save', designAndAssets)

    }, [usePrebuiltGame, handleIncomingDesign])

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
                    handleIncomingDesign,
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
                    </SpritesProvider>
                </AssetsProvider>
            </GameDesignProvider>
        </ThemeProvider >
    )
}

export default GameEditor