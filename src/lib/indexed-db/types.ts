import { GameDesign } from "@/definitions";
import { ImageAsset, SoundAsset } from "@/services/assets";
import { DBSchema, IDBPDatabase } from "idb";

type Name = string;
export type SavedDesignKey = 'quit-save' | `SAVE_${Name}` 

export interface GameEditorDBSchema extends DBSchema {
    'designs': {
        key: SavedDesignKey;
        value: {
            design: GameDesign,
            timestamp: number,
        };
    };
    'image-assets': {
        key: string;
        value: {
            savedDesign: SavedDesignKey;
            asset: ImageAsset;
            file: File;
        }
        indexes: { 'by-design-key': SavedDesignKey }
    };
    'sound-assets': {
        key: string;
        value: {
            savedDesign: SavedDesignKey;
            asset: SoundAsset;
            file: File;
        }
        indexes: { 'by-design-key': SavedDesignKey }
    };
}

export type GameEditorDatabase = IDBPDatabase<GameEditorDBSchema>;

export type DesignListing = { design: GameDesign, timestamp: number, key: SavedDesignKey }
