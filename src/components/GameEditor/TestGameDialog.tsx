import { Game } from "@/components/game/Game";
import { useGameDesign } from "@/context/game-design-context";
import { useSprites } from "@/context/sprite-context";
import { Dialog, DialogTitle, DialogActions, Button, DialogContent } from "@mui/material";
import { useState } from "react";
import { BooleanInput } from "../SchemaForm/BooleanInput";
import { useAssets } from "@/context/asset-context";

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
                <BooleanInput value={showDebugLog} inputHandler={setShowDebugLog} label="debug log" />
                <Button onClick={reset} >reset game test</Button>
                <Button onClick={close} >close game test</Button>
            </DialogActions>
            <DialogTitle>Test: {gameDesign.id}</DialogTitle>
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