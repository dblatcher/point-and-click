import { AssetsProvider } from '@/context/asset-context';
import { GameDesignProvider } from '@/context/game-design-context';
import { SpritesProvider } from '@/context/sprite-context';
import { Sprite } from '@/lib/Sprite';
import { TabId, tabOrder } from '@/lib/editor-config';
import { getInitalDesign } from '@/lib/game-design-logic/initial-design';
import { gameDesignReducer } from '@/lib/game-design-logic/reducer';
import { GameEditorProps } from '@/lib/game-design-logic/types';
import { ImageService } from '@/services/imageService';
import { populateServices, populateServicesForPreBuiltGame } from '@/services/populateServices';
import { SoundService } from '@/services/soundService';
import { editorTheme } from '@/theme';
import { Box, Container, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, ThemeProvider } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react';
import { MainWindow } from './MainWindow';
import { PlayCircleFilledOutlinedIcon } from './material-icons';
import { TestGameDialog } from './TestGameDialog';
import { SaveLoadAndUndo } from './SaveLoadAndUndo';
import { GameDesign } from '@/definitions';
import { ImageAsset, SoundAsset } from '@/services/assets';

export type { GameEditorProps };


const FunctionalEditor: React.FunctionComponent<GameEditorProps> = ({ usePrebuiltGame }) => {

    const [soundService] = useState(new SoundService())
    const [imageService] = useState(new ImageService())
    const [gameTestDialogOpen, setGameTestDialogOpen] = useState(false);
    const [resetTimeStamp, setResetTimeStamp] = useState(0);

    const [gameEditorState, dispatchDesignUpdate] = useReducer(gameDesignReducer,
        {
            gameDesign: getInitalDesign(usePrebuiltGame),
            history: [],
            tabOpen: 'main',
            gameItemIds: {},
        }
    )

    useEffect(() => {
        if (usePrebuiltGame) {
            populateServicesForPreBuiltGame(imageService, soundService)
        }
    }, [])

    const { gameDesign, gameItemIds, tabOpen, history } = gameEditorState

    const sprites = [...gameDesign.sprites.map(data => new Sprite(data, imageService.get.bind(imageService)))]
    const openInEditor = (tabId: TabId, itemId?: string) =>
        dispatchDesignUpdate({ type: 'open-in-editor', itemId, tabId });

    const loadNewGame = (data: {
        gameDesign: GameDesign;
        imageAssets: ImageAsset[];
        soundAssets: SoundAsset[];
    }) => {
        soundService.removeAll();
        imageService.removeAll();

        dispatchDesignUpdate({ type: 'load-new', gameDesign: data.gameDesign })
        populateServices(
            data.gameDesign, data.imageAssets, data.soundAssets,
            imageService, soundService
        )
    }

    return (
        <ThemeProvider theme={editorTheme}>
            <GameDesignProvider value={
                {
                    gameDesign: gameEditorState.gameDesign,
                    openInEditor,
                    applyModification: (description, mod) => dispatchDesignUpdate({ type: 'modify-design', description, mod }),
                    createGameDataItem: () => { },
                    deleteArrayItem: () => { },
                    changeOrAddInteraction: () => { },
                    deleteInteraction: () => { },
                    modifyRoom: () => { },
                }
            }>

                <AssetsProvider soundService={soundService} imageService={imageService}>
                    <SpritesProvider value={sprites}>
                        <Container maxWidth='xl'
                            component={'main'}
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                overflow: 'hidden',
                                flex: 1,
                                gap: 5,
                                background: 'white',
                            }}>

                            <Stack
                                component={'nav'}
                                spacing={1}
                                width={150}
                            >
                                <Stack direction={'row'} marginTop={3} spacing={3} minHeight={35}>
                                    <SaveLoadAndUndo
                                        loadNewGame={loadNewGame}
                                        history={history}
                                        undo={() => dispatchDesignUpdate({ type: 'undo' })}
                                    />

                                    <IconButton
                                        onClick={() => {
                                            setGameTestDialogOpen(true)
                                            setResetTimeStamp(Date.now())
                                        }}
                                    >
                                        <PlayCircleFilledOutlinedIcon fontSize={'large'} />
                                    </IconButton>
                                </Stack>

                                <List disablePadding>
                                    {tabOrder.map((tab, index) => (
                                        <ListItem key={index} disableGutters disablePadding>
                                            <ListItemButton
                                                onClick={() => { openInEditor(tab.id) }}
                                                selected={tab.id === gameEditorState.tabOpen}
                                            >
                                                <ListItemText>{index + 1}</ListItemText>
                                                <ListItemText>{tab.label}</ListItemText>
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Stack>

                            <Box component={'section'} flex={1} padding={1} sx={{ overflowY: 'auto' }}>
                                <MainWindow
                                    gameItemIds={gameItemIds}
                                    tabOpen={tabOpen}
                                    openInEditor={openInEditor} />
                            </Box>

                            <TestGameDialog
                                isOpen={gameTestDialogOpen}
                                close={() => setGameTestDialogOpen(false)}
                                reset={() => setResetTimeStamp(Date.now())}
                                resetTimeStamp={resetTimeStamp}
                            />
                        </Container>
                    </SpritesProvider>
                </AssetsProvider>
            </GameDesignProvider>
        </ThemeProvider >
    )
}

export default FunctionalEditor