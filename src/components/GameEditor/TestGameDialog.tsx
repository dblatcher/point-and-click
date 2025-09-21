import { Game } from "@/components/game/Game";
import { useAssets } from "@/context/asset-context";
import { useGameDesign } from "@/context/game-design-context";
import { useSprites } from "@/context/sprite-context";
import { GameDesign } from "@/definitions";
import { cloneData } from "@/lib/clone";
import { editorTheme } from "@/theme";
import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, IconButton, Slider, ThemeProvider, Typography } from "@mui/material";
import { useState } from "react";
import { BooleanInput } from "../SchemaForm/BooleanInput";
import { ChangeGameStateDialog } from "./ChangeGameStateDialog";
import { PlayCircleFilledOutlinedIcon } from "./material-icons";


export const TestGameDialog = () => {
    const sprites = useSprites()
    const { gameDesign } = useGameDesign()
    const { soundService } = useAssets()
    const [showDebugLog, setShowDebugLog] = useState(false)
    const [haveStartedTests, setHaveStartedTest] = useState(false)
    const [gameSpeed, setGameSpeed] = useState(1)
    const [modifiedGameDesign, setModifiedGameDesign] = useState(cloneData(gameDesign))
    const [gameTestDialogOpen, setGameTestDialogOpen] = useState(false);
    const [resetTimeStamp, setResetTimeStamp] = useState(0);

    const reset = () => setResetTimeStamp(Date.now())
    const close = () => {
        setGameTestDialogOpen(false)
        setHaveStartedTest(false)
    }

    const handleModifiedDesign = (newGameDesignMod: GameDesign) => {
        setModifiedGameDesign(cloneData({ ...gameDesign, ...newGameDesignMod }))
        setHaveStartedTest(true)
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

            <ThemeProvider theme={editorTheme}>
                <Dialog
                    fullScreen
                    open={gameTestDialogOpen}
                    onClose={close}
                >
                    <DialogActions>
                        <DialogContentText sx={{ marginRight: 'auto' }}>Test: {gameDesign.id}</DialogContentText>
                        <Box display='flex' alignItems={'center'} gap={4}>
                            <Typography variant="caption">game speed</Typography>
                            <Slider
                                sx={{ width: 100 }}
                                size="small"
                                marks={[{ value: 1 }]}
                                min={.5} max={10} step={.25}
                                valueLabelDisplay="off"
                                onChange={(_, value) => setGameSpeed(Array.isArray(value) ? value[0] : value)}
                                value={gameSpeed}
                            />
                            <Typography minWidth={30} variant="caption">{gameSpeed === 1 ? 'normal' : `${((gameSpeed * 100)).toFixed(0)}%`}</Typography>
                        </Box>

                        <BooleanInput value={showDebugLog} inputHandler={setShowDebugLog} label="debug log" />
                        <ButtonGroup>
                            <Button onClick={reset} >reset</Button>
                            <ChangeGameStateDialog sendModifiedDesign={handleModifiedDesign} />
                            <Button onClick={close} >close</Button>
                        </ButtonGroup>
                    </DialogActions>
                    <DialogContent sx={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        {haveStartedTests && (
                            <Game
                                key={resetTimeStamp}
                                {...modifiedGameDesign}
                                showDebugLog={showDebugLog}
                                _sprites={sprites}
                                soundService={soundService}
                                timerInterval={10}
                                orderSpeed={gameSpeed}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </ThemeProvider>
        </>
    )
}