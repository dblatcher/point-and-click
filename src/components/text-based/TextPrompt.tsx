import { useGameInfo } from "@/context/game-info-provider"
import { useGameState, useGameStateDerivations } from "@/context/game-state-context"
import { Command } from "@/definitions"
import { Box, TextField } from "@mui/material"
import { useRef, useState } from "react"
import { clamp } from "@/lib/util"
import { promptToCommand, promptToHelpText } from "@/lib/text-parsing"

interface Props {
    sendCommand: { (command: Command): void }
}

const maxHistoryLength = 20

// TO DO - needs to be disabled when UI should be disabled
export const TextPrompt = ({ sendCommand }: Props) => {
    const { verbs } = useGameInfo()
    const { inventory } = useGameStateDerivations()
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
        const helpText = promptToHelpText(promptText, verbs, inventory)
        const command = promptToCommand(promptText, verbs, inventory, gameState)
        if (helpText) {
            gameState.emitter.emit('prompt-feedback', { message: helpText })
        } else if (command) {
            sendCommand(command)
        } else {
            gameState.emitter.emit('prompt-feedback', { message: 'Did not understand your command' })
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