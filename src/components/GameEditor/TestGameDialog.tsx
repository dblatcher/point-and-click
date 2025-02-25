import { Game } from "@/components/game/Game";
import { useAssets } from "@/context/asset-context";
import { useGameDesign } from "@/context/game-design-context";
import { useSprites } from "@/context/sprite-context";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, IconButton } from "@mui/material";
import { useState } from "react";
import { BooleanInput } from "../SchemaForm/BooleanInput";
import { PlayCircleFilledOutlinedIcon } from "./material-icons";
import { RangeInput } from "./RangeInput";
import { ChangeGameStateDialog } from "./ChangeGameStateDialog";
import { GameDesign } from "@/definitions";
import { cloneData } from "@/lib/clone";


export const TestGameDialog = () => {
    const sprites = useSprites()
    const { gameDesign } = useGameDesign()
    const { soundService } = useAssets()
    const [showDebugLog, setShowDebugLog] = useState(false)
    const [gameSpeed, setGameSpeed] = useState(1)
    const [modifiedGameDesign, setModifiedGameDesign] = useState(cloneData(gameDesign))
    const [gameTestDialogOpen, setGameTestDialogOpen] = useState(false);
    const [resetTimeStamp, setResetTimeStamp] = useState(0);

    const reset = () => setResetTimeStamp(Date.now())
    const close = () => setGameTestDialogOpen(false)

    const handleModifiedDesign = (newGameDesignMod: GameDesign) => {
        setModifiedGameDesign(cloneData({ ...gameDesign, ...newGameDesignMod }))
        reset()
    }

    return (
        <>
            <IconButton
                onClick={() => {
                    setGameTestDialogOpen(true)
                    setResetTimeStamp(Date.now())
                }}
            >
                <PlayCircleFilledOutlinedIcon sx={{ fontSize: 100 }} />
            </IconButton>
            <Dialog
                fullScreen
                open={gameTestDialogOpen}
                onClose={close}
            >
                <DialogActions>
                    <DialogContentText sx={{ marginRight: 'auto' }}>Test: {gameDesign.id}</DialogContentText>
                    <RangeInput label="game speed"
                        min={.5} max={10} step={.25}
                        value={gameSpeed}
                        labelProps={{ minWidth: 50 }}
                        formattedValue={gameSpeed === 1 ? 'normal' : `${((gameSpeed * 100)).toFixed(0)}%`}
                        onChange={event => setGameSpeed(Number(event.target.value))}
                    />
                    <BooleanInput value={showDebugLog} inputHandler={setShowDebugLog} label="debug log" />
                    <Button onClick={reset} >reset game test</Button>
                    <Button onClick={close} >close game test</Button>
                    <ChangeGameStateDialog sendModifiedDesign={handleModifiedDesign} />
                </DialogActions>
                <DialogContent sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <Game
                        key={resetTimeStamp}
                        {...modifiedGameDesign} actorOrders={{}}
                        gameNotBegun
                        showDebugLog={showDebugLog}
                        _sprites={sprites}
                        soundService={soundService}
                        timerInterval={10}
                        orderSpeed={gameSpeed}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}