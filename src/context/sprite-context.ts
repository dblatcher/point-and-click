import { createContext, useContext } from 'react'
import { Sprite } from '@/lib/Sprite'

const spritesContext = createContext<Sprite[]>([])

export const SpritesProvider = spritesContext.Provider

export const useSprites = () => {
    return useContext(spritesContext)
}