import { useGameDesign } from '@/context/game-design-context';
import { ActorDataSchema } from "@/definitions/ActorData";
import { ConversationSchema } from "@/definitions/Conversation";
import { GameDataItemType } from "@/definitions/Game";
import { ItemDataSchema } from "@/definitions/ItemData";
import { RoomDataSchema } from "@/definitions/RoomData";
import { SpriteDataSchema } from "@/definitions/SpriteSheet";
import { findById } from "@/lib/util";
import { Box } from "@mui/material";
import { TabId, tabOrder } from "../../lib/editor-config";
import { ActorEditor } from "./ActorEditor";
import { ConversationEditor } from "./ConversationEditor";
import { DataItemCreator } from "./DataItemCreator";
import { EndingEditor } from "./EndingEditor";
import { ImageAssetTool } from "./ImageAssetTool";
import { InteractionEditor } from "./InteractionEditor";
import { ItemEditor } from "./ItemEditor";
import { Overview } from "./Overview";
import { RoomEditor } from "./RoomEditor";
import { SequenceEditor } from "./SequenceEditor";
import { SoundAssetTool } from "./SoundAssetTool";
import { SpriteEditor } from "./SpriteEditor";
import { VerbEditor } from "./VerbEditor";
import { VerbMenuEditor } from "./VerbMenuEditor";
import { getBlankRoom, makeBlankActor, makeBlankConversation, makeBlankEnding, makeBlankItem, makeBlankSequence, makeBlankSprite, makeBlankVerb } from "./defaults";
import { useKeyBoard } from '@/hooks/use-keyboard';
import { useAssets } from '@/context/asset-context';

type Props = {
    tabOpen?: TabId;
    gameItemIds: Partial<Record<GameDataItemType, string>>
    openInEditor: { (tabType: TabId, itemId?: string): void }
}

export const MainWindow = ({ tabOpen, gameItemIds, openInEditor }: Props) => {
    const { gameDesign } = useGameDesign()
    const { imageService, soundService } = useAssets()

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
    const currentVerb = findById(gameItemIds.verbs, gameDesign.verbs)
    const currentEnding = findById(gameItemIds.endings, gameDesign.endings)
    const currentRoom = findById(gameItemIds.rooms, gameDesign.rooms)
    const currentSprite = findById(gameItemIds.sprites, gameDesign.sprites)
    const currentItem = findById(gameItemIds.items, gameDesign.items)
    const currentActor = findById(gameItemIds.actors, gameDesign.actors)
    const currentConversation = findById(gameItemIds.conversations, gameDesign.conversations)


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
                ? <ActorEditor data={currentActor} />
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
        case 'endings':
            return currentEnding
                ? <EndingEditor ending={currentEnding} />
                : <DataItemCreator
                    createBlank={makeBlankEnding}
                    designProperty="endings"
                    itemTypeName="ending"
                />
        case 'verbs':
            return currentVerb
                ? <VerbEditor verb={currentVerb}
                />
                : <>
                    <VerbMenuEditor />
                    <Box marginTop={2}>
                        <DataItemCreator
                            createBlank={makeBlankVerb}
                            designProperty="verbs"
                            itemTypeName="verb"
                        />
                    </Box>
                </>
        case 'images':
            return <ImageAssetTool imageService={imageService} />
        case 'sounds':
            return <SoundAssetTool soundService={soundService} />
        default:
        case 'main':
            return <Overview />
    }
}
