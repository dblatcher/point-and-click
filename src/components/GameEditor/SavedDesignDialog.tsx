import { useAssets } from "@/context/asset-context";
import { useGameDesign } from "@/context/game-design-context";
import { getInitalDesign } from "@/lib/game-design-logic/initial-design";
import { DesignListing, GameEditorDatabase, SavedDesignKey, deleteSavedDesign, retrieveAllSavedDesigns } from "@/lib/indexed-db";
import { retrieveDesignAndAssets, storeDesignAndAllAssetsToDb } from "@/lib/indexed-db/complex-transactions";
import SaveIcon from '@mui/icons-material/Save';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List } from "@mui/material";
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { DescriptionWithSaveTime, DesignListItem } from "../DesignListItem";
import { ButtonWithConfirm } from "./ButtonWithConfirm";
import { ButtonWithTextInput } from "./ButtonWithTextInput";
import { ClearIcon, DeleteIcon } from "./material-icons";

interface Props {
    db: GameEditorDatabase
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const SavedDesignDialog: React.FunctionComponent<Props> = ({ db, isOpen, setIsOpen }) => {
    const { gameDesign, dispatchDesignUpdate, handleIncomingDesign } = useGameDesign()
    const { imageService, soundService } = useAssets()
    const [designList, setDesignList] = useState<DesignListing[]>([])

    const refreshList = useCallback(() => retrieveAllSavedDesigns(db)().then(setDesignList), [db])

    useEffect(() => {
        if (isOpen) {
            refreshList()
        }
    }, [db, isOpen, refreshList])

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
        retrieveDesignAndAssets(db)(savedDesignKey).then((designAndAssets) => {
            const success = handleIncomingDesign(savedDesignKey, designAndAssets)
            if (!success) {
                alert(`could not load ${savedDesignKey}`)
                return undefined
            }
            storeDesignAndAllAssetsToDb(db)(gameDesign, 'quit-save', soundService, imageService)
            setIsOpen(false)
        })
    }

    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
            <DialogTitle sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                <span>Saved designs</span>
                <IconButton onClick={() => setIsOpen(false)}><ClearIcon /></IconButton>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Database V{db.version}, {designList.length} saved designs
                </DialogContentText>
                <List dense>
                    {designList.map(({ key, design, timestamp }) => (
                        <DesignListItem key={key}
                            onClick={() => loadFile(key)}
                            title={`${design.id} [${key}]`}
                            schemaVersion={design.schemaVersion}
                            description={<DescriptionWithSaveTime timestamp={timestamp} gameDesign={design} />}
                            secondaryAction={
                                <>
                                    {gameDesign.id === design.id && (
                                        <IconButton onClick={() => saveOverFile(key)} title={`save over ${key}`}>
                                            <SaveIcon fontSize="large" />
                                        </IconButton>
                                    )}
                                    <ButtonWithConfirm
                                        label={`delete saved design "${key}"`}
                                        confirmationText={`Are you sure you want to delete the saved design "${key}"? THIS ACTION CANNOT BE UNDONE.`}
                                        useIconButton
                                        buttonProps={{ color: 'warning' }}
                                        onClick={() => deleteFile(key)}
                                        icon={<DeleteIcon fontSize="large" />}
                                    />
                                </>
                            }
                        />
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <ButtonWithTextInput
                    label="create new save file"
                    dialogTitle="enter save file name"
                    onEntry={handleNewSaveInput}
                    buttonProps={{
                        startIcon: <SaveIcon />
                    }}
                />
                <ButtonWithConfirm
                    label="reset editor"
                    onClick={() => {
                        dispatchDesignUpdate({ type: 'load-new', gameDesign: getInitalDesign() })
                        soundService.populate([])
                        imageService.populate([])
                        setIsOpen(false)
                    }}
                    confirmationText={`Are you sure you want to reset the editor to a blank game? THIS ACTION CANNOT BE UNDONE.`}
                    buttonProps={{
                        startIcon: <DeleteIcon />,
                        color: "warning"
                    }}
                />
            </DialogActions>
        </Dialog>
    )
}
