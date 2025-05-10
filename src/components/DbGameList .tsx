import { GameDesign } from "@/definitions";
import { parseAndUpgrade } from "@/lib/design-version-management";
import { makeDownloadFile } from "@/lib/files";
import { DesignListing, GameEditorDatabase, retrieveAllSavedDesigns, SavedDesignKey } from "@/lib/indexed-db";
import { retrieveDesignAndAssets } from "@/lib/indexed-db/complex-transactions";
import { buildGameZipBlobFromAssets } from "@/lib/zipFiles";
import { ImageAsset, SoundAsset } from "@/services/assets";
import { List } from "@mui/material";
import { useEffect, useState } from "react";
import { DescriptionWithSaveTime } from "./DesignListItem";
import { GameLoaderDesignItem } from "./GameLoaderDesignItem";

interface Props {
    onLoad: { (design: GameDesign, imageAssets: ImageAsset[], soundAssets: SoundAsset[]): void }
    onError: { (message: string): void }
    db: GameEditorDatabase
}

export const DbGameList = ({ onLoad, onError, db }: Props) => {

    const [designList, setDesignList] = useState<DesignListing[]>([])

    useEffect(() => {
        retrieveAllSavedDesigns(db)().then(setDesignList)
    }, [db, setDesignList])

    const loadGameFromDb = async (key: SavedDesignKey) => {
        if (!db) {
            return
        }
        const { design: designFromDb, imageAssets, soundAssets } = await retrieveDesignAndAssets(db)(key)
        if (!designFromDb) {
            onError(`Failed to load ${key} from local database.`)
            return
        }

        const { gameDesign, failureMessage } = parseAndUpgrade(designFromDb)
        if (!gameDesign) {
            onError(`Failed to upgrade ${key} to current version: ${failureMessage ?? 'UNKNOWN'}`)
            return
        }

        onLoad(gameDesign, imageAssets, soundAssets)
    }

    return (
        <List dense>
            {designList.map(({ design, key, timestamp }, index) => (
                <GameLoaderDesignItem key={index}
                    title={`${design.id} [${key}]`}
                    content={<DescriptionWithSaveTime timestamp={timestamp} gameDesign={design} />}
                    loadGame={() => loadGameFromDb(key)}
                    downloadFunction={async () => {
                        const { imageAssets, soundAssets } = await retrieveDesignAndAssets(db)(key)
                        const zipResult = await buildGameZipBlobFromAssets(design, imageAssets, soundAssets)
                        if (zipResult.success) {
                            makeDownloadFile(`${design.id}.game.zip`, zipResult.blob);
                        } else {
                            onError(`download failed`)
                        }
                    }}
                />
            ))}
        </List>
    )
}