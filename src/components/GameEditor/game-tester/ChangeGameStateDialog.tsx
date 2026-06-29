import { GameDesignProvider, useGameDesign } from "@/context/game-design-context"
import { GameDesignAction, GameEditorState } from "@/lib/game-design-logic/types"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { GameDesign } from "point-click-lib"
import { Dispatch, useState } from "react"
import { ChangeGameStateControls } from "./ChangeGameStateControls"
import { UndoAndRedoButtons } from "../HistoryButtons"


interface Props {
    sendModifiedDesign: { (gameDesign: GameDesign): void }
    modifiedGameEditorState: GameEditorState;
    dispatchDesignUpdate: Dispatch<GameDesignAction>
}

export const ChangeGameStateDialog = ({ sendModifiedDesign, modifiedGameEditorState, dispatchDesignUpdate }: Props) => {
    const { gameDesign: actualGameDesign } = useGameDesign()
    const [dialogOpen, setDialogOpen] = useState(true)

    const closeAndSendDesign = () => {
        setDialogOpen(false)
        sendModifiedDesign(modifiedGameEditorState.gameDesign)
    }

    const closeAndPlayActual = () => {
        setDialogOpen(false)
        sendModifiedDesign(actualGameDesign)
    }

    return (
        <GameDesignProvider input={{
            ...modifiedGameEditorState,
            dispatchDesignUpdate,
            handleIncomingDesign: () => true,
            interactionIndex: undefined,
        }}>
            <Button onClick={() => setDialogOpen(true)} >Modify</Button>
            <Dialog open={dialogOpen} onClose={closeAndPlayActual} fullWidth maxWidth={'md'}>
                <DialogTitle justifyContent={'space-between'} display={"flex"}>
                    Modify game: {actualGameDesign.id}
                    <Box display={'flex'} gap={4}>
                        <Button variant="outlined" onClick={() => {
                            dispatchDesignUpdate({ type: 'load-new', gameDesign: actualGameDesign })
                        }}>reset changes</Button>
                        <UndoAndRedoButtons />
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <ChangeGameStateControls />
                </DialogContent>
                <DialogActions sx={{ gap: 3 }}>
                    <DialogContentText>
                        This control is for changing the starting conditions of the game for testing.
                        It does not make any permanent changes to your game design.
                    </DialogContentText>
                    <Button variant="outlined" onClick={closeAndPlayActual}>run actual design</Button>
                    <Button variant="contained" onClick={closeAndSendDesign}>run design with modifications</Button>
                </DialogActions>
            </Dialog>
        </GameDesignProvider>
    )
}