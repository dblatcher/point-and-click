import { Tutorial, TutorialStage } from "@/lib/game-design-logic/types";
import type { Dispatch, SetStateAction } from "react";
import { createContext, ReactNode, useState } from "react";

type TutuorialContextInputs = {
    tutorial?: Tutorial
}
type TutuorialContextProps = {
    tutorial?: Tutorial
    stageIndex: number
    setStageIndex: Dispatch<SetStateAction<number>>
    currentStage?: TutorialStage
    onLastStage: boolean
    progressToNextStage: { (): void }
}

export const TutorialContext = createContext<TutuorialContextProps>({
    tutorial: undefined,
    stageIndex: 0,
    setStageIndex: () => { },
    onLastStage: false,
    progressToNextStage: () => { },
})

export const TutorialProvider = ({
    children,
    tutorial
}: {
    children: ReactNode
} & TutuorialContextInputs) => {

    const [stageIndex, setStageIndex] = useState(0)
    const currentStage = tutorial?.stages[stageIndex];
    const onLastStage = stageIndex + 1 === tutorial?.stages.length;

    const progressToNextStage = () => {
        if (!onLastStage) {
            setStageIndex(index => index + 1)
        }
    }


    return <TutorialContext.Provider
        value={{
            tutorial,
            stageIndex,
            setStageIndex,
            currentStage,
            onLastStage,
            progressToNextStage
        }}>
        {children}
    </TutorialContext.Provider>
}