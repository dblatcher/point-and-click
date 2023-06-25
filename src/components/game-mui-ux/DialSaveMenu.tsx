import PauseIcon from '@mui/icons-material/Pause';
import PlayIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LoadIcon from '@mui/icons-material/Restore';
import SaveIcon from '@mui/icons-material/Save';
import { Dialog, SpeedDialIcon } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { SaveMenuProps } from "../game/uiComponentSet";

export const DialSaveMenu = ({ save, reset, load, isPaused, setIsPaused }: SaveMenuProps) => {

    return <>
        <SpeedDial ariaLabel="save and pause menu"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            direction="up"
            icon={<SpeedDialIcon />}
        >
            <SpeedDialAction icon={<PauseIcon />} tooltipTitle="pause" onClick={() => { setIsPaused(!isPaused) }} tooltipOpen />
            <SpeedDialAction icon={<SaveIcon />} tooltipTitle="save" onClick={save} tooltipOpen />
            <SpeedDialAction icon={<LoadIcon />} tooltipTitle="load" onClick={load} tooltipOpen />
            <SpeedDialAction icon={<RestartAltIcon />} tooltipTitle="restart" onClick={reset} tooltipOpen />
        </SpeedDial>


        <Dialog open={isPaused} onClose={() => { setIsPaused(false) }}>
            <IconButton onClick={() => { setIsPaused(false) }}>
                <PlayIcon fontSize="large" color={"primary"} />
            </IconButton>
        </Dialog>
    </>

}