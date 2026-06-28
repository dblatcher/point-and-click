import { GameDesignProvider, useGameDesign } from "@/context/game-design-context"
import { GameDesignAction, GameEditorState } from "@/lib/game-design-logic/types"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
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

    return (
        <GameDesignProvider input={{
            ...modifiedGameEditorState,
            dispatchDesignUpdate,
            handleIncomingDesign: () => true,
            interactionIndex: undefined,
        }}>
            <Button onClick={() => setDialogOpen(true)} >Modify</Button>
            <Dialog open={dialogOpen} onClose={closeAndSendDesign} fullWidth maxWidth={'md'}>
                <DialogTitle>
                    Modify game: {actualGameDesign.id}
                </DialogTitle>
                <DialogContent>
                    <ChangeGameStateControls />
                </DialogContent>
                <DialogActions sx={{gap:3}}>
                    <DialogContentText>
                        This control is for changing the starting conditions of the game for testing.
                        It does not make any permanent changes to your game design.
                    </DialogContentText>
                    <UndoAndRedoButtons />
                    <Button variant="outlined" onClick={() => {
                        dispatchDesignUpdate({ type: 'load-new', gameDesign: actualGameDesign })
                    }}>reset changes</Button>
                    <Button variant="contained" onClick={closeAndSendDesign} >start game with changes</Button>
                </DialogActions>
            </Dialog>
        </GameDesignProvider>
    )
}