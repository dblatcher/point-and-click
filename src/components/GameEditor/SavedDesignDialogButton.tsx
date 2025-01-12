import { Dialog, DialogContent, DialogContentText, DialogTitle, IconButton } from "@mui/material";
import React, { useState } from "react";
// import LoadIcon from '@mui/icons-material/Restore';
import SaveIcon from '@mui/icons-material/Save';
import { GameEditorDatabase, retrieveSavedDesign, listSavedDesignKeys, storeSavedDesign, SavedDesignKey, deleteSavedDesign } from "@/lib/indexed-db";
import { GameDesign } from "@/definitions";
import { ButtonWithTextInput } from "./ButtonWithTextInput";
import { useGameDesign } from "@/context/game-design-context";
import { useAssets } from "@/context/asset-context";
import { retrieveDesignAndPopulateAssets, saveDesignAndAllAssetsToDb } from "@/lib/indexed-db/complex-transactions";

interface Props {
    db: GameEditorDatabase
}

type DesignListing = { design: GameDesign, timestamp: number, key: SavedDesignKey }

const fetchSavedDesigns = async (db: GameEditorDatabase): Promise<DesignListing[]> => {
    const designKeys = (await listSavedDesignKeys(db)()).filter(key => key !== 'quit-save')
    const uncheckedResults = await Promise.all(
        designKeys.map(key => retrieveSavedDesign(db)(key))
    );
    const validResults: { design: GameDesign, timestamp: number }[] = uncheckedResults
        .flatMap(({ design, timestamp = 0 }) => design ? { design, timestamp } : []);

    return validResults.map((result, index) => ({ ...result, key: designKeys[index] }))
}

export const SavedDesignDialogButton: React.FunctionComponent<Props> = ({ db }) => {

    const { gameDesign, dispatchDesignUpdate } = useGameDesign()
    const { imageService, soundService } = useAssets()

    const [isOpen, setIsOpen] = useState(false)
    const [designList, setDesignList] = useState<DesignListing[]>([])

    const refreshList = () => fetchSavedDesigns(db).then(setDesignList)

    const openAndFetch = () => {
        setIsOpen(true)
        refreshList()
    }

    const handleNewSaveInput = (name: string) => {
        const newSaveKey: SavedDesignKey = `SAVE_${name.toUpperCase()}`
        if (designList.some(design => design.key === newSaveKey)) {
            alert(`there is already a ${newSaveKey}`)
            return
        }
        saveDesignAndAllAssetsToDb(db)(gameDesign, newSaveKey, soundService,imageService).then(() => {
            refreshList()
        })
    }

    const saveOverFile = (key: SavedDesignKey) => {
        saveDesignAndAllAssetsToDb(db)(gameDesign, key, soundService,imageService).then(() => {
            refreshList()
        })
    }

    const deleteFile = (key: SavedDesignKey) => {
        deleteSavedDesign(db)(key).then(() => {
            refreshList()
        })
    }
    const loadFile = (key: SavedDesignKey) => {
        retrieveDesignAndPopulateAssets(db)(key, soundService, imageService).then(gameDesign => {
            console.log(gameDesign)
            if (!gameDesign) {
                alert(`could not load ${key}`)
                return
            }
            dispatchDesignUpdate({type:'load-new', gameDesign})
            setIsOpen(false)
        })
    }

    return <>

        <IconButton disabled={!db} onClick={openAndFetch}>
            <SaveIcon />
        </IconButton>

        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
            <DialogTitle>Saved designs</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Database V{db.version}
                </DialogContentText>
                <DialogContentText>
                    {designList.length} saved designs
                </DialogContentText>

                {designList.map(({ key, design, timestamp }) => (
                    <div key={key}>
                        <div>
                            <span>{key}</span>
                            <span>--{design.id}</span>
                            <span>--{timestamp}</span>
                        </div>
                        <div>
                            <button onClick={() => deleteFile(key)}>delete</button>
                            <button onClick={() => saveOverFile(key)}>save over</button>
                            <button onClick={() => loadFile(key)}>load</button>
                        </div>
                    </div>
                ))}

                <ButtonWithTextInput
                    label="create new save"
                    dialogTitle="enter save file name"
                    onEntry={handleNewSaveInput}
                />
            </DialogContent>
        </Dialog>
    </>

}
