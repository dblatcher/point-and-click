import { GameDesignProvider, useGameDesign } from "@/context/game-design-context"
import { GameDesign } from "@/definitions"
import { cloneData } from "@/lib/clone"
import { gameDesignReducer } from "@/lib/game-design-logic/reducer"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { useReducer, useState } from "react"
import { ChangeGameStateControls } from "./ChangeGameStateControls"


interface Props {
    sendModifiedDesign: { (gameDesign: GameDesign): void }
}

export const ChangeGameStateDialog = ({ sendModifiedDesign }: Props) => {
    const { gameDesign } = useGameDesign()
    const [dialogOpen, setDialogOpen] = useState(true)

    const [modifiedGameState, dispatchDesignUpdate] = useReducer(gameDesignReducer,
        {
            gameDesign: cloneData(gameDesign),
            history: [],
            undoneHistory: [],
            tabOpen: 'main',
            gameItemIds: {},
        }
    )

    return <>
        <Button onClick={() => setDialogOpen(true)} >Modify</Button>
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth={'md'}>
            <DialogTitle>Modify game: {gameDesign.id}</DialogTitle>
            <DialogContent>
                <GameDesignProvider input={{
                    ...modifiedGameState,
                    dispatchDesignUpdate
                }}>
                    <ChangeGameStateControls />
                </GameDesignProvider>
            </DialogContent>
            <DialogActions>
                <DialogContentText>
                    This control is for changing the starting conditions of the game for testing.
                    It does not make any permanent changes to your game design.
                </DialogContentText>
                <Button variant="outlined" onClick={() => {
                    dispatchDesignUpdate({ type: 'load-new', gameDesign: gameDesign })
                }}>reset changes</Button>
                <Button variant="contained" onClick={() => {
                    setDialogOpen(false)
                    sendModifiedDesign(modifiedGameState.gameDesign)
                }} >start game with changes</Button>
            </DialogActions>
        </Dialog>
    </>
}