import { AssetsProvider } from '@/context/asset-context';
import { GameDesignProvider } from '@/context/game-design-context';
import { SpritesProvider } from '@/context/sprite-context';
import { Sprite } from '@/lib/Sprite';
import { getInitalDesign } from '@/lib/game-design-logic/initial-design';
import { GameDesignAction, GameEditorProps, GameEditorState } from '@/lib/game-design-logic/types';
import { ImageService } from '@/services/imageService';
import { populateServicesForPreBuiltGame } from '@/services/populateServices';
import { SoundService } from '@/services/soundService';
import { editorTheme } from '@/theme';
import { ThemeProvider } from '@mui/material';
import React, { Reducer, useEffect, useReducer, useState } from 'react';
import { Overview } from './Overview';

export type { GameEditorProps };

const gameDesignReducer: Reducer<GameEditorState, GameDesignAction> = (gameEditorState, action) => {
    switch (action.type) {
    }
    return gameEditorState
}




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
    })

    const sprites = [...gameEditorState.gameDesign.sprites.map(data => new Sprite(data, imageService.get.bind(imageService)))]

    return (
        <ThemeProvider theme={editorTheme}>
            <GameDesignProvider value={
                {
                    gameDesign: gameEditorState.gameDesign,
                    createGameDataItem: () => { },
                    deleteArrayItem: () => { },
                    openInEditor: () => { },
                    changeOrAddInteraction: () => { },
                    deleteInteraction: () => { },
                    applyModification: () => { },
                    modifyRoom: () => { },
                }
            }>

                <AssetsProvider soundService={soundService} imageService={imageService}>
                    <SpritesProvider value={sprites}>
                        <div>
                            FunctionalEditor
                            <p>{usePrebuiltGame?.toString()}</p>
                            <Overview />
                        </div>
                    </SpritesProvider>
                </AssetsProvider>
            </GameDesignProvider>
        </ThemeProvider >
    )
}

export default FunctionalEditor