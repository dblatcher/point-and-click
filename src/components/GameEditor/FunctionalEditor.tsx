import { AssetsProvider } from '@/context/asset-context';
import { GameDesignProvider } from '@/context/game-design-context';
import { SpritesProvider } from '@/context/sprite-context';
import { GameDesign } from '@/definitions';
import { TabId } from '@/lib/editor-config';
import { getInitalDesign } from '@/lib/game-design-logic/initial-design';
import { gameDesignReducer } from '@/lib/game-design-logic/reducer';
import { GameEditorProps } from '@/lib/game-design-logic/types';
import { Sprite } from '@/lib/Sprite';
import { patchMember } from "@/lib/update-design";
import { ImageAsset, SoundAsset } from '@/services/assets';
import { ImageService } from '@/services/imageService';
import { populateServices, populateServicesForPreBuiltGame } from '@/services/populateServices';
import { SoundService } from '@/services/soundService';
import { editorTheme } from '@/theme';
import { Box, ButtonGroup, Container, Stack, ThemeProvider } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react';
import { MainWindow } from './MainWindow';
import { SaveAndLoadButtons } from './SaveAndLoadButtons';
import { TabButtonList } from './TabButtonList';
import { TestGameDialog } from './TestGameDialog';
import { UndoButton } from './UndoButton';

export type { GameEditorProps };


const FunctionalEditor: React.FunctionComponent<GameEditorProps> = ({ usePrebuiltGame }) => {

    const [soundService] = useState(new SoundService())
    const [imageService] = useState(new ImageService())

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

    const { gameDesign, history } = gameEditorState

    const sprites = [...gameDesign.sprites.map(data => new Sprite(data, imageService.get.bind(imageService)))]

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
                    tabOpen: gameEditorState.tabOpen,
                    gameItemIds: gameEditorState.gameItemIds,
                    openInEditor: (tabId: TabId, itemId?: string) => dispatchDesignUpdate({ type: 'open-in-editor', itemId, tabId }),
                    applyModification: (description, mod) => dispatchDesignUpdate({ type: 'modify-design', description, mod }),
                    createGameDataItem: (property, data) => dispatchDesignUpdate({ type: 'create-data-item', property, data }),
                    deleteArrayItem: (index, property) => dispatchDesignUpdate({ type: 'delete-data-item', index, property }),
                    changeOrAddInteraction: (data, index) => dispatchDesignUpdate({ type: 'change-or-add-interaction', index, data }),
                    deleteInteraction: (index) => dispatchDesignUpdate({ type: 'delete-interaction', index }),
                    modifyRoom: (description, id, mod) => dispatchDesignUpdate({ type: 'modify-design', description, mod: { rooms: patchMember(id, mod, gameDesign.rooms) } }),
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
                                    <UndoButton history={history}
                                        undo={() => dispatchDesignUpdate({ type: 'undo' })} />
                                    <SaveAndLoadButtons
                                        loadNewGame={loadNewGame} />
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

export default FunctionalEditor