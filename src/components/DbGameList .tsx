import { GameDesign } from "@/definitions";
import { DesignListing, GameEditorDatabase, retrieveAllSavedDesigns, SavedDesignKey } from "@/lib/indexed-db";
import { retrieveDesignAndAssets } from "@/lib/indexed-db/complex-transactions";
import { ImageAsset, SoundAsset } from "@/services/assets";
import { List } from "@mui/material";
import { useEffect, useState } from "react";
import { DesignCard } from "./DesignCard";

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
        const { design, imageAssets, soundAssets } = await retrieveDesignAndAssets(db)(key)
        if (!design) {
            onError(`Failed to load ${key} from local database.`)
            return
        }
        onLoad(design, imageAssets, soundAssets)
    }

    return (
        <List dense>
            {designList.map(({ design, key }, index) => (
                <DesignCard key={index}
                    title={design.id}
                    content={design.description}
                    loadGame={() => loadGameFromDb(key)}
                />
            ))}
        </List>
    )

}