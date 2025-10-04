import { AssetsProvider } from '@/context/asset-context';
import { GameDesignProvider } from '@/context/game-design-context';
import { usePageMeta } from '@/context/page-meta-context';
import { SpritesProvider } from '@/context/sprite-context';
import { parseAndUpgrade } from '@/lib/design-version-management';
import { getInitalDesign } from '@/lib/game-design-logic/initial-design';
import { gameDesignReducer } from '@/lib/game-design-logic/reducer';
import { GameEditorProps } from '@/lib/game-design-logic/types';
import { handleImageUpdateFunction, handleSoundUpdateFunction } from '@/lib/handle-asset-functions';
import { GameEditorDatabase, MaybeDesignAndAssets, openDataBaseConnection } from '@/lib/indexed-db';
import { retrieveDesignAndAssets } from '@/lib/indexed-db/complex-transactions';
import { Sprite } from '@/lib/Sprite';
import { ImageService } from '@/services/imageService';
import { populateServicesForPreBuiltGame } from '@/services/populateServices';
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
import { UndoAndRedoButtons } from './UndoButton';
import { UpgradeNotice } from './UpgradeNotice';
import { ZipFileButtons } from './ZipFileButtons';
import { TutorialContent } from './tutorial/TutorialContent';
import { getGameFromApi } from '@/lib/api-usage';
import { TutorialContainer } from './tutorial/TutorialContainer';


export type { GameEditorProps };

const GameEditor: React.FunctionComponent<GameEditorProps> = ({ usePrebuiltGame, tutorial }) => {
    const [soundService] = useState(new SoundService())
    const [imageService] = useState(new ImageService())
    const [saveMenuOpen, setSaveMenuOpen] = useState(false)
    const [templateMenuOpen, setTemplateMenuOpen] = useState(false)
    const [waitingForDesignFromDb, setWaitingforDesignFromDb] = useState(!usePrebuiltGame)
    const { setHeaderContent } = usePageMeta();

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

        const dateString = timestamp ? `${new Date(timestamp).toLocaleDateString()},  ${new Date(timestamp).toLocaleTimeString()}` : 'unknown time';
        console.log(`retrieved ${sourceIdentifier} from ${dateString}`)

        const { gameDesign, failureMessage, updated, sourceVersion } = parseAndUpgrade(design);

        if (!gameDesign) {
            alert(`Could not parse ${sourceIdentifier}: ${failureMessage ?? 'UNKNOWN'}`);
            setWaitingforDesignFromDb(false);
            return false
        }
        if (updated) {
            console.log(`Updated from version ${sourceVersion}`);
            dispatchDesignUpdate({ type: 'set-upgrade-info', data: { sourceIdentifier, sourceVersion } });
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
        if (tutorial?.designId) {
            const loadResult = await getGameFromApi(tutorial.designId);
            if (!loadResult.success) {
                alert('failed to load tutorial')
                return
            }
            const { gameDesign, imageAssets, soundAssets } = loadResult.data
            handleIncomingDesign('tutorial', { design: gameDesign, imageAssets, soundAssets })
            return
        }

        const designAndAssets = await retrieveDesignAndAssets(db)('quit-save')
        const wasQuitSave = handleIncomingDesign('quit-save', designAndAssets)
        if (!wasQuitSave) {
            setTemplateMenuOpen(true)
        }
    }, [usePrebuiltGame, handleIncomingDesign, tutorial?.designId])

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

    const { gameDesign, history, undoneHistory } = gameEditorState;

    useEffect(() => {
        setHeaderContent(
            <Box display={'flex'} alignItems={'center'}>
                {!waitingForDesignFromDb && (
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
                    <Avatar sx={{ backgroundColor: 'primary.contrastText' }}>
                        <IconButton
                            disabled={waitingForDesignFromDb || !gameEditorState.db}
                            title='save menu'
                            onClick={() => setSaveMenuOpen(true)}
                        >
                            <SaveIcon color='primary' />
                        </IconButton>
                    </Avatar>
                </ Box>
            </Box>
        )
    }, [waitingForDesignFromDb, gameDesign.id, setHeaderContent, gameEditorState.db, saveMenuOpen])

    if (waitingForDesignFromDb) {
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