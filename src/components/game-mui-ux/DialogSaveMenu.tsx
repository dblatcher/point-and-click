import { useGameState } from '@/context/game-state-context';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LoadIcon from '@mui/icons-material/Restore';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { useState } from 'react';
import { SaveMenuProps } from "../game/uiComponentSet";
import { StringInput } from '../SchemaForm/StringInput';
import { SoundToggle } from './SoundToggle';


export const DialogSaveMenu = ({ save, load, isPaused, setIsPaused, listSavedGames, deleteSave }: SaveMenuProps) => {

    const { updateGameState } = useGameState();
    const [newSaveName, setNewSaveName] = useState('')
    const [savedGameNames, setSavedGameNames] = useState(listSavedGames?.() ?? [])

    const saveNewGame = () => {
        if (!save || !newSaveName) {
            return
        }
        save(newSaveName)
        setNewSaveName('')
        setSavedGameNames(listSavedGames?.() ?? [])
    }
    const deleteGameAndUpdateList = (saveName: string) => {
        deleteSave?.(saveName)
        setSavedGameNames(listSavedGames?.() ?? [])
    }

    return <>

        <SoundToggle buttonType='IconButton' />
        <IconButton onClick={() => { setIsPaused(true) }} aria-label='settings' size='large'>
            <SettingsIcon fontSize='large' />
        </IconButton>

        <Dialog open={isPaused} onClose={() => { setIsPaused(false) }} >
            <DialogTitle>Menu</DialogTitle>
            <DialogContent>
                <List dense>
                    <List dense>
                        <ListItemButton onClick={() => { setIsPaused(false) }}>
                            <ListItemIcon><PlayIcon /></ListItemIcon>
                            <ListItemText primary="Continue" />
                        </ListItemButton>
                        <ListItemButton onClick={() => updateGameState({ type: 'RESTART' })}>
                            <ListItemIcon><RestartAltIcon /></ListItemIcon>
                            <ListItemText primary="Restart" />
                        </ListItemButton>
                    </List>

                    {(!!load && !!save) && (
                        <List dense
                            subheader={
                                <ListSubheader disableGutters component="div">Saved Games</ListSubheader>
                            }
                        >
                            {savedGameNames.map((saveName, index) => (
                                <ListItem key={index} disablePadding>
                                    <IconButton onClick={() => load(saveName)}>
                                        <LoadIcon />
                                    </IconButton>
                                    <ListItemText primary={saveName} />
                                    <IconButton onClick={() => deleteGameAndUpdateList(saveName)}>
                                        <DeleteIcon color='warning' />
                                    </IconButton>
                                    <IconButton onClick={() => save(saveName)}>
                                        <SaveIcon />
                                    </IconButton>
                                </ListItem>
                            ))}
                            <ListItem disablePadding>
                                <Box display={'flex'}>
                                    <StringInput label='saved game name' value={newSaveName} inputHandler={setNewSaveName} />
                                    <IconButton onClick={saveNewGame}>
                                        <SaveIcon />
                                    </IconButton>
                                </Box>
                            </ListItem>
                        </List>
                    )}
                </List>
            </DialogContent>
        </Dialog>
    </>

}