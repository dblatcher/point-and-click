import { GameDesign } from "@/definitions";
import { ImageAsset, SoundAsset } from "@/services/assets";
import { DBSchema, IDBPDatabase } from "idb";

export type SavedDesignKey = 'quit-save'

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
