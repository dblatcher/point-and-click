import { GameDesign } from "@/definitions";
import { parseAndUpgrade } from "@/lib/design-version-management";
import { makeDownloadFile } from "@/lib/files";
import { GameEditorDatabase, SavedDesignKey, DesignListingWithThumbnail } from "@/lib/indexed-db";
import { retrieveAllDesignSummariesAndThumbnails, retrieveDesignAndAssets } from "@/lib/indexed-db/complex-transactions";
import { buildGameZipBlobFromAssets } from "@/lib/zipFiles";
import { ImageAsset, SoundAsset } from "@/services/assets";
import { List } from "@mui/material";
import { useEffect, useState } from "react";
import { GameLoaderDesignItem } from "./GameLoaderDesignItem";
import { displaySaveKey, formatTimestamp } from "@/lib/util";

interface Props {
    onLoad: { (design: GameDesign, imageAssets: ImageAsset[], soundAssets: SoundAsset[]): void }
    onError: { (message: string): void }
    db: GameEditorDatabase
}

export const DbGameList = ({ onLoad, onError, db }: Props) => {
    const [designList, setDesignList] = useState<DesignListingWithThumbnail[]>([])
    useEffect(() => {
        retrieveAllDesignSummariesAndThumbnails(db)().then(setDesignList);
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
            {designList.map(({ designSummary, key, timestamp, thumbnail }, index) => (
                <GameLoaderDesignItem key={index}
                    title={displaySaveKey(key)}
                    imageUrl={thumbnail?.href}
                    content={<><b>{designSummary.id}</b> - {formatTimestamp(timestamp)}</>}
                    loadGame={() => loadGameFromDb(key)}
                    downloadFunction={async () => {
                        const { design, imageAssets, soundAssets } = await retrieveDesignAndAssets(db)(key)
                        if (!design) {
                            return onError(`download failed`)
                        }
                        const zipResult = await buildGameZipBlobFromAssets(design as GameDesign, imageAssets, soundAssets)
                        if (zipResult.success) {
                            makeDownloadFile(`${designSummary.id}.game.zip`, zipResult.blob);
                        } else {
                            onError(`download failed`)
                        }
                    }}
                />
            ))}
        </List>
    )
}