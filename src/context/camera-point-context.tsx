import { XY } from '@/lib/types-and-constants'
import { createContext, useContext } from 'react'

const cameraPointContext = createContext<{
    cameraPoint?: XY
}>({})

export const CamerPointProvider = cameraPointContext.Provider

export const useCameraPoint = () => {
    return useContext(cameraPointContext)
}

