import { AssetsProvider } from '@/context/asset-context';
import { GameDesignProvider } from '@/context/game-design-context';
import { usePageMeta } from '@/context/page-meta-context';
import { SpritesProvider } from '@/context/sprite-context';
import { getGameFromApi } from '@/lib/api-usage';
import { parseAndUpgrade } from '@/lib/design-version-management';
import { getInitalDesign } from '@/lib/game-design-logic/initial-design';
import { gameDesignReducer } from '@/lib/game-design-logic/reducer';
import { GameEditorProps } from '@/lib/game-design-logic/types';
import { handleSoundUpdateToQuitSaveFunction, storeImageUpdateToQuitSaveFunction } from '@/lib/handle-asset-functions';
import { MaybeDesignAndAssets, openDataBaseConnection } from '@/lib/indexed-db';
import { retrieveDesignAndAssets } from '@/lib/indexed-db/complex-transactions';
import { Sprite } from '@/lib/Sprite';
import { UpdateSource } from '@/services/FileAssetService';
import { ImageService } from '@/services/imageService';
import { SoundService } from '@/services/soundService';
import { Avatar, Box, ButtonGroup, IconButton, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { GameEditorSkeleton } from '../GameEditorSkeleton';
import { MainWindow } from './MainWindow';
import { DesignServicesIcon, SaveIcon } from './material-icons';
import { SavedDesignDialog } from './SavedDesignDialog';
import { TabButtonList } from './TabButtonList';
import { TemplateDesignDialog } from './TemplateDesignDialog';
import { TestGameDialog } from './TestGameDialog';
import { TutorialContainer } from './tutorial/TutorialContainer';
import { UndoAndRedoButtons } from './UndoButton';
import { UpgradeNotice } from './UpgradeNotice';
import { ZipFileButtons } from './ZipFileButtons';


export type { GameEditorProps };

const GameEditor: React.FunctionComponent<GameEditorProps> = ({ usePrebuiltGame, tutorial }) => {
    const [soundService] = useState(new SoundService())
    const [imageService] = useState(new ImageService())
    const [saveMenuOpen, setSaveMenuOpen] = useState(false)
    const [templateMenuOpen, setTemplateMenuOpen] = useState(false)
    const [isWaitingForDesign, setIsWaitingforDesign] = useState(true)
    const { setHeaderContent } = usePageMeta();

    const [gameEditorState, dispatchDesignUpdate] = useReducer(gameDesignReducer,
        {
            gameDesign: getInitalDesign(),
            history: [],
            undoneHistory: [],
            tabOpen: 'main',
            gameItemIds: {},
        }
    )

    const handleIncomingDesign = useCallback((sourceIdentifier: string, designAndAssets: MaybeDesignAndAssets, updateSource: UpdateSource): boolean => {
        const { design, timestamp, imageAssets, soundAssets } = designAndAssets;
        if (!design) {
            console.log(`no design ${sourceIdentifier} found`);
            return false
        }
        const dateString = timestamp ? `[${new Date(timestamp).toLocaleDateString()},  ${new Date(timestamp).toLocaleTimeString()}]` : '';
        console.log(`retrieved ${sourceIdentifier} from ${updateSource} ${dateString}`)

        const { gameDesign, failureMessage, updated, sourceVersion } = parseAndUpgrade(design);

        if (!gameDesign) {
            alert(`Could not parse ${sourceIdentifier}: ${failureMessage ?? 'UNKNOWN'}`);
            return false
        }
        if (updated) {
            console.log(`Updated from version ${sourceVersion}`);
            dispatchDesignUpdate({ type: 'set-upgrade-info', data: { sourceIdentifier, sourceVersion } });
        }
        imageService.populate(imageAssets, updateSource)
        soundService.populate(soundAssets, updateSource)
        dispatchDesignUpdate({ type: 'load-new', gameDesign })
        return true
    }, [imageService, soundService])


    // load the initial design for the tutorial or prebuilt game, 
    // or open DB and load quit-save
    useEffect(() => {
        if (tutorial) {
            getGameFromApi(tutorial.designId).then(loadResult => {
                setIsWaitingforDesign(false)
                if (!loadResult.success) {
                    alert('failed to load tutorial')
                    return
                }
                const { gameDesign, imageAssets, soundAssets } = loadResult.data
                setIsWaitingforDesign(false)
                handleIncomingDesign('tutorial-design', { design: gameDesign, imageAssets, soundAssets }, 'API')
            })
            return
        }

        if (usePrebuiltGame) {
            getGameFromApi('test').then(loadResult => {
                setIsWaitingforDesign(false)
                if (!loadResult.success) {
                    alert('failed to load test game')
                    return
                }
                const { gameDesign, imageAssets, soundAssets } = loadResult.data
                setIsWaitingforDesign(false)
                handleIncomingDesign('test-game', { design: gameDesign, imageAssets, soundAssets }, 'API')
            })
            return
        }

        openDataBaseConnection()
            .then(async ({ db }) => {
                dispatchDesignUpdate({ type: 'set-db-instance', db })
                console.log(`DB opened, version ${db.version}`)

                const designAndAssets = await retrieveDesignAndAssets(db)('quit-save')
                setIsWaitingforDesign(false)
                const wasQuitSaveSuccessfullyLoaded = handleIncomingDesign('quit-save', designAndAssets, 'DB_QUIT_SAVE')
                if (!wasQuitSaveSuccessfullyLoaded) {
                    setTemplateMenuOpen(true)
                }
            })
            .catch(err => {
                console.error('OPEN DB FAILED!!', err)
                setIsWaitingforDesign(false)
            })
    }, [dispatchDesignUpdate, handleIncomingDesign, setIsWaitingforDesign, tutorial, usePrebuiltGame])

    // if using db, listen to updates from services and store in the quit save
    useEffect(() => {
        if (!gameEditorState.db) { return }
        const updateQuitSaveImages = storeImageUpdateToQuitSaveFunction(imageService, gameEditorState.db)
        const updateQuitSaveSounds = handleSoundUpdateToQuitSaveFunction(soundService, gameEditorState.db)
        imageService.on('update', updateQuitSaveImages)
        soundService.on('update', updateQuitSaveSounds)

        return () => {
            imageService.off('update', updateQuitSaveImages)
            soundService.off('update', updateQuitSaveSounds)
        }
    }, [imageService, soundService, gameEditorState.db])

    const { gameDesign, history, undoneHistory } = gameEditorState;

    useEffect(() => {
        setHeaderContent(
            <Box display={'flex'} alignItems={'center'}>
                {!isWaitingForDesign && (
                    <Typography sx={{ fontSize: '120%', margin: 0, }}>
                        Game Designer
                    </Typography>
                )}
                <Box
                    display={'flex'}
                    marginLeft={'auto'}
                    gap={1}
                >
                    <Avatar sx={{ backgroundColor: 'primary.contrastText' }}>
                        <IconButton
                            title='design menu'
                            onClick={() => setTemplateMenuOpen(true)}
                        >
                            <DesignServicesIcon color='primary' />
                        </IconButton>
                    </Avatar>
                    {gameEditorState.db && (
                        <Avatar sx={{ backgroundColor: 'primary.contrastText' }}>
                            <IconButton
                                disabled={isWaitingForDesign}
                                title='save menu'
                                onClick={() => setSaveMenuOpen(true)}
                            >
                                <SaveIcon color='primary' />
                            </IconButton>
                        </Avatar>
                    )}
                </ Box>
            </Box>
        )
    }, [isWaitingForDesign, gameDesign.id, setHeaderContent, gameEditorState.db, saveMenuOpen])

    if (isWaitingForDesign) {
        return <GameEditorSkeleton />
    }

    const sprites = [...gameDesign.sprites.map(data => new Sprite(data, imageService.get.bind(imageService)))]

    return (
        <GameDesignProvider input={
            {
                gameDesign: gameEditorState.gameDesign,
                tabOpen: gameEditorState.tabOpen,
                gameItemIds: gameEditorState.gameItemIds,
                upgradeInfo: gameEditorState.upgradeInfo,
                dispatchDesignUpdate,
                handleIncomingDesign,
            }
        }>
            <AssetsProvider soundService={soundService} imageService={imageService}>
                <SpritesProvider value={sprites}>

                    <Box component={'main'}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            overflow: 'hidden',
                            flex: 1,
                        }}>

                        <Stack component={'nav'}>
                            <ButtonGroup orientation="horizontal" >
                                <UndoAndRedoButtons history={history} undoneHistory={undoneHistory} />
                                <ZipFileButtons />
                            </ButtonGroup>

                            <TabButtonList />
                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
                                <TestGameDialog />
                            </div>
                        </Stack>
                        <Box component={'section'}
                            flex={1}
                            margin={1}
                            paddingX={1}
                            display={'flex'}
                            flexDirection={'column-reverse'}
                            sx={{ overflowY: 'auto', backgroundColor: 'white' }}
                        >
                            <MainWindow />
                            {tutorial && (
                                <TutorialContainer tutorial={tutorial} />
                            )}
                            <UpgradeNotice />
                        </Box>
                    </Box>

                    {gameEditorState.db &&
                        <SavedDesignDialog db={gameEditorState.db} isOpen={saveMenuOpen} setIsOpen={setSaveMenuOpen} />
                    }
                    <TemplateDesignDialog isOpen={templateMenuOpen} setIsOpen={setTemplateMenuOpen} />
                </SpritesProvider>
            </AssetsProvider>
        </GameDesignProvider>
    )
}

export default GameEditor