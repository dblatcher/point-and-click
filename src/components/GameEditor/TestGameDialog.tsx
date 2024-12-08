import { Game } from "@/components/game/Game";
import { useAssets } from "@/context/asset-context";
import { useGameDesign } from "@/context/game-design-context";
import { useSprites } from "@/context/sprite-context";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import { useState } from "react";
import { BooleanInput } from "../SchemaForm/BooleanInput";

interface Props {
    isOpen: boolean
    close: { (): void }
    resetTimeStamp: number
    reset: { (): void }
}

export const TestGameDialog = ({ isOpen, close, resetTimeStamp, reset }: Props) => {
    const sprites = useSprites()
    const { gameDesign } = useGameDesign()
    const { soundService } = useAssets()
    const [showDebugLog, setShowDebugLog] = useState(false)

    return (
        <Dialog
            fullScreen
            open={isOpen}
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
                />
            </DialogContent>

        </Dialog>
    )
}