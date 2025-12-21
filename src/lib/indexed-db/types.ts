import { ImageAsset, SoundAsset } from "@/services/assets";
import { DBSchema, IDBPDatabase } from "idb";
import { GameDesign, V2GameDesign } from "point-click-lib";

type Name = string;
export type SavedDesignKey = 'quit-save' | `SAVE_${Name}`

export interface GameEditorDBSchema extends DBSchema {
    'designs': {
        key: SavedDesignKey;
        value: {
            design: GameDesign | V2GameDesign,
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

export type MaybeDesignAndAssets = {
    design: unknown,
    timestamp?: number,
    imageAssets: ImageAsset[],
    soundAssets: SoundAsset[]
}

export type DesignSummary = Pick<GameDesign, 'id' | 'description' | 'thumbnailAssetId'> & { schemaVersion?: number }

export type DesignListingWithThumbnail = {
    thumbnail?: ImageAsset;
    key: SavedDesignKey;
    designSummary: DesignSummary
    timestamp: number;
};
