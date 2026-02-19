import { deleteSave, listSavedGames, load, save } from "@/lib/local-saves";
import { GameDataContext } from "point-click-components";
import { GameData } from "point-click-lib";
import { useContext } from "react";


export const useLocalSavedGame = () => {
    const {gameState, dispatch} = useContext(GameDataContext)
    const restart = () => dispatch({ type: 'RESET' });

    const saveGame = (fileName?: string) => save(gameState.id)(gameState, fileName);
    const loadCallback = (data: GameData) => dispatch({ type: 'HANDLE-LOAD', data });
    const loadGame = (fileName?: string) => load(gameState.id)(loadCallback, fileName);

    return {
        saveGame,
        loadGame,
        listSavedGames: listSavedGames(gameState.id),
        deleteSave: deleteSave(gameState.id),
        restart
    }
}