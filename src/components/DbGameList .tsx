import { GameDesign } from "@/definitions";
import { GameEditorDatabase, openDataBaseConnection, retrieveAllSavedDesigns, DesignListing, SavedDesignKey } from "@/lib/indexed-db";
import { retrieveDesignAndAssets } from "@/lib/indexed-db/complex-transactions";
import { ImageAsset, SoundAsset } from "@/services/assets";
import { Card, Grid, Stack, useTheme } from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
    onLoad: { (design: GameDesign, imageAssets: ImageAsset[], soundAssets: SoundAsset[]): void }
    onError: { (message: string): void }
}

export const DbGameList = ({ onLoad, onError }: Props) => {

    const [db, setDb] = useState<GameEditorDatabase | undefined>(undefined)
    const [designList, setDesignList] = useState<DesignListing[]>([])
    const theme = useTheme()

    useEffect(() => {

        let referenceToDbWithinThisHook: GameEditorDatabase | undefined = undefined
        openDataBaseConnection().then(db => {
            if (!db) {
                console.warn('no db')
            }
            referenceToDbWithinThisHook = db
            setDb(db)
            retrieveAllSavedDesigns(db)().then(setDesignList)
        })

        return () => {
            referenceToDbWithinThisHook?.close()
        }

    }, [setDb])

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
        <Grid container spacing={2} padding={2}
            justifyContent="center"
            alignItems="center">
            <Grid item xs={9}>
                <Stack gap={2}>
                    {designList.map(({ design, key }, index) => (
                        <Card key={index}
                            sx={{
                                backgroundColor: theme.palette.secondary.light,
                                fontFamily: theme.typography.fontFamily,
                            }}>
                            <div>
                                {design.id}, {key}
                            </div>
                            <div>
                                {design.description ?? '[no description]'}
                            </div>
                            <button onClick={() => {
                                loadGameFromDb(key)
                            }}>load</button>
                        </Card>
                    ))}
                </Stack>
            </Grid>
        </Grid>
    )

}