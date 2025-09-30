import { useGameDesign } from '@/context/game-design-context';
import { ActorDataSchema } from "@/definitions/ActorData";
import { ConversationSchema } from "@/definitions/Conversation";
import { ItemDataSchema } from "@/definitions/ItemData";
import { RoomDataSchema } from "@/definitions/RoomData";
import { SpriteDataSchema } from "@/definitions/SpriteSheet";
import { useKeyBoard } from '@/hooks/use-keyboard';
import { findById } from "@/lib/util";
import { tabOrder } from "../../lib/editor-config";
import { ActorEditor } from "./ActorEditor";
import { ConversationEditor } from "./ConversationEditor";
import { getBlankRoom, makeBlankActor, makeBlankConversation, makeBlankItem, makeBlankSequence, makeBlankSprite, makeEmptyStoryBoard } from "./defaults";
import { DataItemCreator } from "./game-item-components/DataItemCreator";
import { ImageAssetManager } from './ImageAssetTool/ImageAssetManager';
import { InteractionEditor } from "./InteractionEditor";
import { ItemEditor } from "./ItemEditor";
import { Overview } from "./Overview";
import { RoomEditor } from "./RoomEditor";
import { SequenceEditor } from "./SequenceEditor";
import { SoundAssetManager } from './SoundAssetTool/SoundAssetManager';
import { SpriteEditor } from "./SpriteEditor";
import { StoryBoardEditor } from './StoryBoardEditor/StoryBoardEditor';
import { VerbSetControl } from './verbs/VerbSetControl';
import { Box, ThemeProvider } from '@mui/material';
import { editorTheme } from '@/theme';

const MainWindowInner = () => {
    const { gameDesign, tabOpen, openInEditor, gameItemIds } = useGameDesign()

    useKeyBoard([
        {
            key: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
            handler: ({ key }) => {
                const tabId = tabOrder[Number(key) - 1]?.id
                if (!tabId) { return }
                openInEditor(tabId)
            }
        },
        {
            key: ['0', '-', '='],
            handler: ({ key }) => {
                switch (key) {
                    case '0': return openInEditor(tabOrder[9].id)
                    case '-': return openInEditor(tabOrder[10].id)
                    case '=': return openInEditor(tabOrder[11].id)
                }
            }
        }
    ])

    const currentSequence = findById(gameItemIds.sequences, gameDesign.sequences)
    const currentRoom = findById(gameItemIds.rooms, gameDesign.rooms)
    const currentSprite = findById(gameItemIds.sprites, gameDesign.sprites)
    const currentItem = findById(gameItemIds.items, gameDesign.items)
    const currentActor = findById(gameItemIds.actors, gameDesign.actors)
    const currentConversation = findById(gameItemIds.conversations, gameDesign.conversations)
    const currentStoryBoard = findById(gameItemIds.storyBoards, gameDesign.storyBoards)

    switch (tabOpen) {
        case 'rooms':
            return currentRoom
                ? <RoomEditor key={gameItemIds.rooms} data={currentRoom} />
                : <DataItemCreator
                    createBlank={getBlankRoom}
                    schema={RoomDataSchema}
                    designProperty="rooms"
                    itemTypeName="room"
                />
        case 'items':
            return currentItem
                ? <ItemEditor item={currentItem} />
                : <DataItemCreator
                    createBlank={makeBlankItem}
                    schema={ItemDataSchema}
                    designProperty="items"
                    itemTypeName="inventory item"
                />
        case 'actors':
            return currentActor
                ? <ActorEditor actorData={currentActor} />
                : <DataItemCreator
                    createBlank={makeBlankActor}
                    schema={ActorDataSchema}
                    designProperty="actors"
                    itemTypeName="actor"
                />
        case 'conversations':
            return currentConversation
                ? <ConversationEditor key={gameItemIds.conversations}
                    conversation={currentConversation} />
                : <DataItemCreator
                    createBlank={makeBlankConversation}
                    schema={ConversationSchema}
                    designProperty="conversations"
                    itemTypeName="conversation"
                />
        case 'sprites':
            return currentSprite
                ? <SpriteEditor data={currentSprite} />
                : <DataItemCreator
                    createBlank={makeBlankSprite}
                    schema={SpriteDataSchema}
                    designProperty="sprites"
                    itemTypeName="sprite"
                />
        case 'interactions':
            return <InteractionEditor />
        case 'sequences':
            return currentSequence
                ? <SequenceEditor key={gameItemIds.sequences}
                    heading='main'
                    data={currentSequence}
                />
                : <DataItemCreator
                    createBlank={makeBlankSequence}
                    designProperty="sequences"
                    itemTypeName="sequence"
                />
        case 'verbs':
            return <VerbSetControl />
        case 'images':
            return <ImageAssetManager />
        case 'sounds':
            return <SoundAssetManager />
        case 'storyBoards':
            return currentStoryBoard ? <StoryBoardEditor storyBoard={currentStoryBoard} /> : <DataItemCreator
                createBlank={makeEmptyStoryBoard}
                designProperty='storyBoards'
                itemTypeName="story board" />
        default:
        case 'main':
            return <Overview />
    }
}

export const MainWindow = () => {

    const { openInEditor } = useGameDesign()

    useKeyBoard([
        {
            key: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
            handler: ({ key }) => {
                const tabId = tabOrder[Number(key) - 1]?.id
                if (!tabId) { return }
                openInEditor(tabId)
            }
        },
        {
            key: ['0', '-', '='],
            handler: ({ key }) => {
                switch (key) {
                    case '0': return openInEditor(tabOrder[9].id)
                    case '-': return openInEditor(tabOrder[10].id)
                    case '=': return openInEditor(tabOrder[11].id)
                }
            }
        }
    ])

    return (
        <ThemeProvider theme={editorTheme}>
            <Box flex={2}>
                <MainWindowInner />
            </Box>
        </ThemeProvider>
    )
}