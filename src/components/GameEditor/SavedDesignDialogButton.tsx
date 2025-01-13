import { Dialog, DialogContent, DialogContentText, DialogTitle, IconButton } from "@mui/material";
import React, { useState } from "react";
import { useAssets } from "@/context/asset-context";
import { useGameDesign } from "@/context/game-design-context";
import { GameDesign } from "@/definitions";
import { GameEditorDatabase, SavedDesignKey, deleteSavedDesign, retrieveAllSavedDesigns } from "@/lib/indexed-db";
import { retrieveDesignAndAssets, storeDesignAndAllAssetsToDb } from "@/lib/indexed-db/complex-transactions";
import SaveIcon from '@mui/icons-material/Save';
import { ButtonWithTextInput } from "./ButtonWithTextInput";

interface Props {
    db: GameEditorDatabase
}

type DesignListing = { design: GameDesign, timestamp: number, key: SavedDesignKey }


export const SavedDesignDialogButton: React.FunctionComponent<Props> = ({ db }) => {

    const { gameDesign, dispatchDesignUpdate } = useGameDesign()
    const { imageService, soundService } = useAssets()

    const [isOpen, setIsOpen] = useState(false)
    const [designList, setDesignList] = useState<DesignListing[]>([])

    const refreshList = () => retrieveAllSavedDesigns(db)().then(setDesignList)

    const openAndFetch = () => {
        setIsOpen(true)
        refreshList()
    }

    const handleNewSaveInput = (name: string) => {
        const savedDesignKey: SavedDesignKey = `SAVE_${name.toUpperCase()}`
        if (designList.some(design => design.key === savedDesignKey)) {
            alert(`there is already a ${savedDesignKey}`)
            return
        }
        storeDesignAndAllAssetsToDb(db)(gameDesign, savedDesignKey, soundService, imageService).then(() => {
            refreshList()
        })
    }

    const saveOverFile = (savedDesignKey: SavedDesignKey) => {
        storeDesignAndAllAssetsToDb(db)(gameDesign, savedDesignKey, soundService, imageService).then(() => {
            refreshList()
        })
    }

    const deleteFile = (savedDesignKey: SavedDesignKey) => {
        deleteSavedDesign(db)(savedDesignKey).then(() => {
            refreshList()
        })
    }
    const loadFile = (savedDesignKey: SavedDesignKey) => {
        retrieveDesignAndAssets(db)(savedDesignKey).then(({design: gameDesign, timestamp, imageAssets, soundAssets}) => {
            if (!gameDesign) {
                alert(`could not load ${savedDesignKey}`)
                return undefined
            }
            imageService.populate(imageAssets, 'DB')
            soundService.populate(soundAssets, 'DB')
            const date = new Date(timestamp)
            console.log(`retrieved ${savedDesignKey} last saved at ${date.toLocaleDateString()},  ${date.toLocaleTimeString()}`)
            dispatchDesignUpdate({ type: 'load-new', gameDesign:gameDesign })
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
