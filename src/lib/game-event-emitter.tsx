import { LogEntry } from "@/lib/inGameDebugging";
import { TypedEmitter } from "tiny-typed-emitter";

export interface GameEvents {
    'debugLog': { (logentry: LogEntry): void }
}

export class GameEventEmitter extends TypedEmitter<GameEvents> {

}
