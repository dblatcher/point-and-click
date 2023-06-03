import { createContext, useContext } from 'react'
import { FixedGameInfo } from '@/definitions/Game'
import { Verb } from '@/definitions'

const gameInfoContext = createContext<FixedGameInfo & { verb?: Verb }>(
    {
        verbs: [],
        sequences: [],
        sprites: [],
        endings: [],
        openingSequenceId: '',
    }
)

export const GameInfoProvider = gameInfoContext.Provider

export const useGameInfo = () => {
    return useContext(gameInfoContext)
}

