import { useGameInfo } from "@/context/game-info-provider"
import { useGameState, useGameStateDerivations } from "@/context/game-state-context"
import { ActorData, Command, HotspotZone, ItemData, Verb } from "@/definitions"
import { Box, TextField } from "@mui/material"
import { useRef, useState } from "react"
import { GameState } from "../game"
import { clamp } from "@/lib/util"

interface Props {
    sendCommand: { (command: Command): void }
}

const maxHistoryLength = 20

const ignoreList = new Set<string>(['the', 'a', 'my',])

const splitPhrase = (phrase: string) => phrase.split(" ").map(word => word.trim().toLowerCase())


const extractVerb = (words: string[], verbs: Verb[]) => {
    const verb = verbs
        .find(verb => splitPhrase(verb.label)
            .every((word, index) => word == words[index]))
    if (!verb) {
        return {
            verb: undefined,
            words
        }
    }
    const verbPhraseLength = splitPhrase(verb.label).length
    return {
        verb: verb,
        words: words.slice(verbPhraseLength)
    }
}

const extractItem = (words: string[], items: ItemData[]) => {
    const item = items
        .find(item => splitPhrase(item.name ?? item.id)
            .every((word, index) => word == words[index]))
    if (!item) {
        return {
            item: undefined,
            words
        }
    }
    const itemPhraseLength = splitPhrase(item.name ?? item.id).length
    return {
        item,
        words: words.slice(itemPhraseLength)
    }
}

const findTargetInRemainingWords = (
    words: string[],
    actors: ActorData[],
    inventory: ItemData[],
    hotspots: HotspotZone[]
): Command['target'] | undefined => {
    const combinedWords = words.join(" ");
    const matchingActor = actors.find(_ => combinedWords.includes((_.name ?? _.id).toLowerCase()))
    const matchingItem = inventory.find(_ => combinedWords.includes((_.name ?? _.id).toLowerCase()))
    const matchingHotspot = hotspots.find(_ => combinedWords.includes((_.name ?? _.id).toLowerCase()))

    // to do - handle ambiguities - duplicate names
    return matchingActor || matchingItem || matchingHotspot
}

const promptToHelpText = (
    promptText: string,
    verbs: Verb[],
    inventory: ItemData[],
): string | undefined => {
    switch (promptText.trim().toUpperCase()) {
        case 'HELP':
            return 'For a list of available verbs, type "verbs" or "V". For a list of what your character is carrying, type "inventory" or "I".'
        case 'V':
        case 'VERBS':
            return `Available verbs: ${verbs.map(verb => `"${verb.label}"`).join(", ")}.`
        case 'I':
        case 'INVENTORY':
            return `You have: ${inventory.map(item => item.name ?? item.name).join(", ")}.`
        default:
            return undefined
    }
}

const promptToCommand = (
    promptText: string,
    verbs: Verb[],
    inventory: ItemData[],
    gameState: GameState
): Command | undefined => {
    const words = splitPhrase(promptText).filter(word => !ignoreList.has(word))
    const { verb, words: wordsMinusVerb } = extractVerb(words, verbs)
    if (!verb) {
        return undefined
    }
    const { item, words: wordsMinusVerbAndMaybeItem } = extractItem(wordsMinusVerb, inventory)
    const actorsInRoom = gameState.actors.filter(actor => actor.room === gameState.currentRoomId)
    const currentRoom = gameState.rooms.find(room => room.id == gameState.currentRoomId);
    const roomHotpots = currentRoom?.hotspots ?? [];
    const target = findTargetInRemainingWords(wordsMinusVerbAndMaybeItem, actorsInRoom, inventory, roomHotpots)
    if (!target) {
        return undefined
    }
    return {
        verb, target, item
    }
}

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
        </Box >
    )
}