import { Game } from "@/components/game/Game";
import { useAssets } from "@/context/asset-context";
import { useGameDesign } from "@/context/game-design-context";
import { useSprites } from "@/context/sprite-context";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, IconButton } from "@mui/material";
import { useState } from "react";
import { BooleanInput } from "../SchemaForm/BooleanInput";
import { PlayCircleFilledOutlinedIcon } from "./material-icons";
import { FullScreenLayout } from "../full-screen-ui/FullScreenLayout";


export const TestGameDialog = () => {
    const sprites = useSprites()
    const { gameDesign } = useGameDesign()
    const { soundService } = useAssets()
    const [showDebugLog, setShowDebugLog] = useState(false)
    const [gameTestDialogOpen, setGameTestDialogOpen] = useState(false);
    const [resetTimeStamp, setResetTimeStamp] = useState(0);

    const reset = () => setResetTimeStamp(Date.now())
    const close = () => setGameTestDialogOpen(false)

    return (
        <>
            <IconButton
                onClick={() => {
                    setGameTestDialogOpen(true)
                    setResetTimeStamp(Date.now())
                }}
            >
                <PlayCircleFilledOutlinedIcon fontSize={'large'} />
            </IconButton>
            <Dialog
                fullScreen
                open={gameTestDialogOpen}
                onClose={close}
            >
                <DialogActions>
                    <DialogContentText sx={{ marginRight: 'auto' }}>Test: {gameDesign.id}</DialogContentText>
                    <BooleanInput value={showDebugLog} inputHandler={setShowDebugLog} label="debug log" />
                    <Button onClick={reset} >reset game test</Button>
                    <Button onClick={close} >close game test</Button>
                </DialogActions>
                <DialogContent>
                    <Game
                        key={resetTimeStamp}
                        {...gameDesign} actorOrders={{}}
                        gameNotBegun
                        showDebugLog={showDebugLog}
                        _sprites={sprites}
                        soundService={soundService}
                        uiComponents={{
                            GameLayoutComponent:FullScreenLayout
                        }}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}