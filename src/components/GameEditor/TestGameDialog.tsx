import Game from "@/components/game";
import { useGameDesign } from "@/context/game-design-context";
import { useSprites } from "@/context/sprite-context";
import { Dialog, DialogTitle, DialogActions, Button, DialogContent } from "@mui/material";

interface Props {
    isOpen: boolean
    close: { (): void }
    resetTimeStamp: number
    reset: { (): void }
}

export const TestGameDialog = ({ isOpen, close, resetTimeStamp, reset }: Props) => {
    const sprites = useSprites()
    const { gameDesign } = useGameDesign()

    return (
        <Dialog
            fullScreen
            open={isOpen}
            onClose={close}
        >
            <DialogTitle>Test: {gameDesign.id}</DialogTitle>
            <DialogContent>
                <Game
                    key={resetTimeStamp}
                    {...gameDesign} actorOrders={{}} 
                    gameNotBegun
                    showDebugLog={true}
                    _sprites={sprites}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={reset} >reset game test</Button>
                <Button onClick={close} >close game test</Button>
            </DialogActions>
        </Dialog>
    )
}