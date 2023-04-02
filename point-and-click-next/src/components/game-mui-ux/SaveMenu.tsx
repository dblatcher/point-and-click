import { Dialog, Box } from "@mui/material";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import { useState } from "react"
import SaveIcon from '@mui/icons-material/Save';
import PauseIcon from '@mui/icons-material/Pause';
import PlayIcon from '@mui/icons-material/PlayArrow';
import { SaveMenuProps } from "../game/uiComponentSet";

export const SaveMenu = ({ save, reset, load, isPaused, setIsPaused }: SaveMenuProps) => {

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const open = () => { setIsDrawerOpen(true) }
    const close = () => { setIsDrawerOpen(false) }

    return <>
        <IconButton onClick={open} >
            <SaveIcon />
        </IconButton>
        <IconButton onClick={() => { setIsPaused(!isPaused) }}>
            {isPaused ? <PlayIcon /> : <PauseIcon />}
        </IconButton>
        <Dialog open={isDrawerOpen} onClose={close}>
            <Box padding={1}>
                <ButtonGroup>
                    {!!save &&
                        <Button onClick={save}>SAVE</Button>
                    }
                    {!!load &&
                        <Button onClick={load}>LOAD</Button>
                    }
                    {!!reset &&
                        <Button onClick={reset}>RESET</Button>
                    }
                </ButtonGroup>
            </Box>
        </Dialog>
    </>

}