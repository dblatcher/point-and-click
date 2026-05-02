import { Tutorial } from "@/lib/game-design-logic/types";
import type { Dispatch, SetStateAction } from "react";
import { createContext, ReactNode, useState } from "react";

type TutuorialContextInputs = {
    tutorial?: Tutorial
}
type TutuorialContextProps = {
    tutorial?: Tutorial
    stageIndex: number
    setStageIndex:  Dispatch<SetStateAction<number>>
}

export const TutorialContext = createContext<TutuorialContextProps>({
    tutorial: undefined,
    stageIndex: 0,
    setStageIndex: ()=>{},
})

export const TutorialProvider = ({
    children,
    tutorial
}: {
    children: ReactNode
} & TutuorialContextInputs) => {

    const [stageIndex, setStageIndex] = useState(0)

    return <TutorialContext.Provider
        value={{ tutorial, stageIndex, setStageIndex }}>
        {children}
    </TutorialContext.Provider>
}