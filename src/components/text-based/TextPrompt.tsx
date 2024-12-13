import { useGameState, useGameStateDerivations } from "@/context/game-state-context"
import { Command, Conversation, ConversationChoice } from "@/definitions"
import { reportConversationBranch } from "@/lib/game-event-emitter"
import { standard } from "@/lib/text-based/standard-text"
import { promptToCommand, promptToHelpFeedback } from "@/lib/text-based/text-parsing"
import { clamp } from "@/lib/util"
import { Box, TextField } from "@mui/material"
import { useRef, useState } from "react"

interface Props {
    clearStoryBoard: { (): void }
}

const maxHistoryLength = 20

// TO DO - needs to be disabled when UI should be disabled
export const TextPrompt = ({
    clearStoryBoard,
}: Props) => {
    const { gameState, gameProps, updateGameState } = useGameState()
    const { inventory, isGameEnded, player, currentConversation: conversation, isSequenceRunning } = useGameStateDerivations()
    const { verbs } = gameProps
    const [promptText, setPromptText] = useState('')
    const [historyIndex, setHistoryIndex] = useState<number | undefined>(undefined)
    const promptHistoryRef = useRef<string[]>([])
    const { current: history } = promptHistoryRef

    const sendCommand = (command: Command) => updateGameState({ type: 'SEND-COMMAND', command, props: gameProps })
    const selectConversationChoice = (choice: ConversationChoice) => updateGameState({ type: 'CONVERSATION-CHOICE', choice })

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
        if (gameState.currentStoryBoardId) {
            clearStoryBoard()
            return
        }
        if (isSequenceRunning) {
            return
        }
        const helpFeedback = promptToHelpFeedback(promptText, verbs, inventory, gameState, player)
        if (helpFeedback) {
            gameState.emitter.emit('prompt-feedback', helpFeedback)
        } else if (conversation) {
            interpretPromptAsConversationChoice(conversation)
        } else {
            interpretPromptAsCommand()
        }

        // do not add people typing dialogue numbers to history
        if (!!helpFeedback || !conversation) {
            addToHistory(promptText)
        }
        setPromptText('')
        setHistoryIndex(undefined)
    }

    const interpretPromptAsConversationChoice = (conversation: Conversation) => {
        const branch = conversation.branches[conversation.currentBranch || conversation.defaultBranch]
        if (!branch) {
            console.error('no branch')
            return
        }
        const availableChoices = branch.choices.filter(choice => !choice.disabled)
        const inputtedNumber = Number(promptText)
        if (isNaN(inputtedNumber)) {
            gameState.emitter.emit('prompt-feedback', { message: standard.INVALID_DIALOG_PROMPT, type: 'system' })
            reportConversationBranch(gameState)
            return
        }
        const choice = availableChoices[inputtedNumber - 1] // not presenting users with zero-based list
        if (!choice) {
            gameState.emitter.emit('prompt-feedback', { message: standard.INVALID_DIALOG_PROMPT, type: 'system' })
            reportConversationBranch(gameState)
            return
        }
        gameState.emitter.emit('prompt-feedback', { message: `"${choice.text}"`, type: 'command' })
        selectConversationChoice(choice)
    }

    const interpretPromptAsCommand = () => {
        const command = promptToCommand(promptText, verbs, inventory, gameState)
        if (isGameEnded) {
            return gameState.emitter.emit('prompt-feedback', { message: standard.GAME_OVER_CANNOT_COMMAND, type: 'system' })
        }
        if (!command) {
            return gameState.emitter.emit('prompt-feedback', { message: standard.PROMPT_NOT_UNDERSTOOD, type: 'system' })
        }
        sendCommand(command)
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