import { Dialog, DialogContent, DialogContentText, DialogTitle, IconButton } from "@mui/material";
import React, { useState } from "react";
// import LoadIcon from '@mui/icons-material/Restore';
import SaveIcon from '@mui/icons-material/Save';
import { GameEditorDatabase, retrieveSavedDesign, listSavedDesignKeys, storeSavedDesign, SavedDesignKey, deleteSavedDesign } from "@/lib/indexed-db";
import { GameDesign } from "@/definitions";
import { ButtonWithTextInput } from "./ButtonWithTextInput";
import { useGameDesign } from "@/context/game-design-context";

interface Props {
    db: GameEditorDatabase
}

type DesignListing = { design: GameDesign, timestamp: number, key: SavedDesignKey }

const fetchSavedDesigns = async (db: GameEditorDatabase): Promise<DesignListing[]> => {
    console.log('fetchSavedDesigns')
    const designKeys = (await listSavedDesignKeys(db)()).filter(key => key !== 'quit-save')
    const uncheckedResults = await Promise.all(
        designKeys.map(key => retrieveSavedDesign(db)(key))
    );
    const validResults: { design: GameDesign, timestamp: number }[] = uncheckedResults
        .flatMap(({ design, timestamp = 0 }) => design ? { design, timestamp } : []);

    const designList = validResults.map((result, index) => ({ ...result, key: designKeys[index] }))

    return designList;
}

export const SavedDesignDialogButton: React.FunctionComponent<Props> = ({ db }) => {

    const { gameDesign } = useGameDesign()

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
        // need assets too
        storeSavedDesign(db)(gameDesign, newSaveKey).then(() => {
            refreshList()
        })
    }

    const saveOverFile = (key: SavedDesignKey) => {
        // need assets too
        storeSavedDesign(db)(gameDesign, key).then(() => {
            refreshList()
        })
    }

    const deleteFile = (key: SavedDesignKey) => {
        deleteSavedDesign(db)(key).then(()=> {
            refreshList()
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
                        <span>{key}</span>
                        <span>--{design.id}</span>
                        <span>--{timestamp}</span>
                        <button onClick={() => deleteFile(key)}>delete</button>
                        <button onClick={() => saveOverFile(key)}>save over</button>
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
