import { createContext } from "react";

type Props = {
    gameId?:string
}

export const SavedGameContext = createContext<Props>({});
