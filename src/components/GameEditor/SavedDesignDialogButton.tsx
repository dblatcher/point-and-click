import { useAssets } from "@/context/asset-context";
import { useGameDesign } from "@/context/game-design-context";
import { DesignListing, GameEditorDatabase, SavedDesignKey, deleteSavedDesign, retrieveAllSavedDesigns } from "@/lib/indexed-db";
import { retrieveDesignAndAssets, storeDesignAndAllAssetsToDb } from "@/lib/indexed-db/complex-transactions";
import SaveIcon from '@mui/icons-material/Save';
import { Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import React, { useState } from "react";
import { ButtonWithTextInput } from "./ButtonWithTextInput";
import { GameDesign } from "@/definitions";
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import { ClearIcon, DeleteIcon } from "./material-icons";
import { ButtonWithConfirm } from "./ButtonWithConfirm";
import { getInitalDesign } from "@/lib/game-design-logic/initial-design";

interface Props {
    db: GameEditorDatabase
}

// TO DO - deduplication display logic with DbGameList
const generateSecondaryContent = (timestamp: number, gameDesign: GameDesign) => {
    const { description } = gameDesign
    const date = new Date(timestamp).toLocaleString();
    return <><b>{date}</b>{' '}{description}</>
}

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
        retrieveDesignAndAssets(db)(savedDesignKey).then(({ design: gameDesign, timestamp, imageAssets, soundAssets }) => {
            if (!gameDesign) {
                alert(`could not load ${savedDesignKey}`)
                return undefined
            }
            imageService.populate(imageAssets, 'DB')
            soundService.populate(soundAssets, 'DB')
            const date = new Date(timestamp)
            console.log(`retrieved ${savedDesignKey} last saved at ${date.toLocaleDateString()},  ${date.toLocaleTimeString()}`)
            dispatchDesignUpdate({ type: 'load-new', gameDesign: gameDesign })
            setIsOpen(false)
        })
    }

    return <>

        <IconButton disabled={!db} onClick={openAndFetch}>
            <SaveIcon />
        </IconButton>

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
                        <ListItem key={key}
                            secondaryAction={
                                <>
                                    {gameDesign.id === design.id && (
                                        <IconButton onClick={() => saveOverFile(key)}>
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
                        >
                            <ListItemButton onClick={() => loadFile(key)}>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'primary.dark' }} ><DesignServicesOutlinedIcon /> </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${design.id} [${key}]`}
                                    secondary={generateSecondaryContent(timestamp, design)}
                                />
                            </ListItemButton>
                        </ListItem>
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
    </>

}
