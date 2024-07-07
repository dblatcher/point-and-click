import { useGameInfo } from "@/context/game-info-provider"
import { useGameState, useGameStateDerivations } from "@/context/game-state-context"
import { Command } from "@/definitions"
import { Box, TextField } from "@mui/material"
import { useRef, useState } from "react"
import { clamp } from "@/lib/util"
import { promptToCommand, promptToHelpFeedback } from "@/lib/text-based/text-parsing"
import { standard } from "@/lib/text-based/standard-text"

interface Props {
    sendCommand: { (command: Command): void }
}

const maxHistoryLength = 20

// TO DO - needs to be disabled when UI should be disabled
export const TextPrompt = ({ sendCommand }: Props) => {
    const { verbs } = useGameInfo()
    const { inventory, isGameEnded, player } = useGameStateDerivations()
    const gameState = useGameState()
    const [promptText, setPromptText] = useState('')
    const [historyIndex, setHistoryIndex] = useState<number | undefined>(undefined)
    const promptHistoryRef = useRef<string[]>([])
    const { current: history } = promptHistoryRef

    const addToHistory = (promptText: string) => {
        if (promptText !== history[history.length - 1] && promptText.length > 0) {
            history.push(promptText)
        }
        if (history.length > maxHistoryLength) {
            history.splice(0, history.length - maxHistoryLength)
        }
    }

    const setPromptFromHistory = (newHistoryIndex: number | undefined) => {
        setPromptText(typeof newHistoryIndex === 'number' ? history[newHistoryIndex] : '')
        setHistoryIndex(newHistoryIndex)
    }

    const handleSubmit = () => {
        addToHistory(promptText)
        const helpFeedback = promptToHelpFeedback(promptText, verbs, inventory, gameState, player)
        const command = promptToCommand(promptText, verbs, inventory, gameState)
        if (helpFeedback) {
            gameState.emitter.emit('prompt-feedback', helpFeedback)
        } else if (isGameEnded) {
            gameState.emitter.emit('prompt-feedback', { message: standard.GAME_OVER_CANNOT_COMMAND, type: 'system' })
        } else if (command) {
            sendCommand(command)
        } else {
            gameState.emitter.emit('prompt-feedback', { message: standard.PROMPT_NOT_UNDERSTOOD, type: 'system' })
        }
        setPromptFromHistory(undefined)
    }

    const scrollThroughHistory = (key: 'ArrowUp' | 'ArrowDown') => {
        if (history.length == 0) {
            return
        }
        if (typeof historyIndex === 'undefined') {
            if (key === 'ArrowUp') {
                setPromptFromHistory(history.length - 1)
            }
            return
        }
        if (key === 'ArrowDown' && historyIndex === history.length - 1) {
            setPromptFromHistory(undefined)
            return
        }
        const newHistoryIndex = clamp(key === 'ArrowUp' ? historyIndex - 1 : historyIndex + 1, history.length - 1, 0)
        setPromptFromHistory(newHistoryIndex)
    }


    return (
        <Box>
            <TextField
                sx={{ width: '100%' }}
                onChange={(event) => {
                    setPromptText(event.target.value)
                }}
                inputProps={{
                    onKeyDown: ({ key }) => {
                        if (key === 'Enter') {
                            handleSubmit()
                        }
                        if (key === 'ArrowUp' || key == 'ArrowDown') {
                            scrollThroughHistory(key)
                        }
                    }
                }}
                value={promptText}
            />
        </Box>
    )
}