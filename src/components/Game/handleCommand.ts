import { GameState } from ".";
import { Command } from "../../lib/Verb";

export function handleCommand(command: Command): { (state: GameState): Partial<GameState> } {

    console.log(command)

    return (state) => {
        return {}
    }
}