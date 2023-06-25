import SettingsIcon from '@mui/icons-material/Settings';
import PlayIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LoadIcon from '@mui/icons-material/Restore';
import SaveIcon from '@mui/icons-material/Save';
import { Button, ButtonGroup, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { SaveMenuProps } from "../game/uiComponentSet";
import { SoundToggle } from './SoundToggle';


export const DialogSaveMenu = ({ save, reset, load, isPaused, setIsPaused }: SaveMenuProps) => {

    return <>

        <IconButton onClick={() => { setIsPaused(true) }} aria-label='settings' color='secondary' size='large'>
            <SettingsIcon fontSize='large' />
        </IconButton>

        <Dialog open={isPaused} onClose={() => { setIsPaused(false) }}>
            <DialogContent>
                <DialogTitle>Menu</DialogTitle>
                <ButtonGroup orientation='vertical' size='large' fullWidth color='secondary'>
                    <Button variant='contained' startIcon={<PlayIcon />} onClick={() => { setIsPaused(false) }}>
                        Continue
                    </Button>
                    <SoundToggle buttonType='Button' color='secondary' />
                    <Button startIcon={<RestartAltIcon />} onClick={reset}>
                        restart
                    </Button>
                    <Button startIcon={<LoadIcon />} onClick={load}>
                        load
                    </Button>
                    <Button startIcon={<SaveIcon />} onClick={save}>
                        save
                    </Button>
                </ButtonGroup>
            </DialogContent>
        </Dialog>
    </>

}