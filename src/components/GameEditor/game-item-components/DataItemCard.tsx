import { ButtonWithTextInput } from "@/components/GameEditor/ButtonWithTextInput";
import { ConceptCard } from "@/components/GameEditor/ConceptCard";
import { FramePreview } from "@/components/GameEditor/FramePreview";
import { DeleteDataItemButton } from "@/components/GameEditor/game-item-components/DeleteDataItemButton";
import { formatIdInput, truncateLine } from "@/components/GameEditor/helpers";
import { InteractionsDialogsButton } from "@/components/GameEditor/InteractionsDialogsButton";
import { ContentCopyIcon, HideImageOutlinedIcon } from "@/components/GameEditor/material-icons";
import { RoomLocationPicker } from "@/components/GameEditor/RoomLocationPicker";
import { SpritePreview } from "@/components/GameEditor/SpritePreview";
import { useGameDesign } from "@/context/game-design-context";
import { useSprites } from "@/context/sprite-context";
import { ActorData, Conversation, GameDataItem, ItemData, RoomData, Sequence, SpriteData } from "@/definitions";
import { GameDataItemType } from "@/definitions/Game";
import { StoryBoard } from "@/definitions/StoryBoard";
import { cloneData } from "@/lib/clone";
import { tabIcons } from "@/lib/editor-config";
import { buildActorData } from "@/lib/sprite-to-actor";
import { findById } from "@/lib/util";
import { Box, BoxProps, Typography } from "@mui/material";
import { StoryPageDisplay } from "../../storyboard/StoryPageDisplay";

type Props<DataType extends GameDataItem> = {
    item: DataType;
    designProperty: GameDataItemType
    itemTypeName: string
    attemptCreate: { (data: DataType): void }
}


const PREVIEW_WIDTH = 100
const PREVIEW_HEIGHT = 80

const previewBoxProps: BoxProps = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: PREVIEW_WIDTH,
    height: PREVIEW_HEIGHT,
}

const ItemPreview = ({ item, designProperty }: { item: GameDataItem, designProperty: GameDataItemType }) => {
    const sprites = useSprites();
    if (designProperty === 'rooms') {
        const roomData = item as RoomData
        return <Box {...previewBoxProps}>
            <RoomLocationPicker roomData={roomData} previewHeight={PREVIEW_HEIGHT} viewAngle={0} previewWidth={PREVIEW_WIDTH} />
        </Box>
    }
    if (designProperty === 'actors') {
        const actorData = item as ActorData
        return <Box {...previewBoxProps}>
            <SpritePreview data={actorData} animation='default' noBaseLine maxHeight={PREVIEW_HEIGHT} />
        </Box>
    }
    if (designProperty === 'sprites') {
        const spriteData = item as SpriteData;
        const sprite = findById(spriteData.id, sprites);
        return <Box {...previewBoxProps}>
            {sprite &&
                <SpritePreview data={buildActorData(sprite, 'default', spriteData.defaultDirection)}
                    animation='default' noBaseLine maxHeight={PREVIEW_HEIGHT} />
            }
        </Box>

    }
    if (designProperty === 'items') {
        const { imageId, row = 0, col = 0 } = item as ItemData
        return <Box {...previewBoxProps}>
            {imageId
                ? <FramePreview frame={{ imageId, row, col }} height={80} width={80} />
                : <HideImageOutlinedIcon sx={{ height: 50, width: 50 }} />
            }
        </Box>
    }
    if (designProperty === 'storyBoards') {
        const { font, pages } = item as StoryBoard;
        const [firstPage] = pages
        return <Box {...previewBoxProps} flexDirection={'column'} alignItems={'stretch'} fontSize={3}>
            {firstPage
                ? <StoryPageDisplay page={firstPage} font={font} />
                : <HideImageOutlinedIcon sx={{ height: 50, width: 50 }} />
            }
        </Box>
    }
    return null
}

const ItemDetails = ({ item, designProperty }: { item: GameDataItem, designProperty: GameDataItemType }) => {
    const { gameDesign: { openingSequenceId, openingStoryboardId } } = useGameDesign()
    switch (designProperty) {
        case "rooms":
            const room = item as RoomData;
            return <Box paddingX={1}>
                {room.name && <Typography>{room.name}</Typography>}
                <Typography>{room.width} x {room.height}</Typography>
                <Typography>x{room.hotspots?.length ?? 0} hotspots</Typography>
            </Box>
        case "items":
            const itemData = item as ItemData;
            return <Box paddingX={1}>
                <Typography>{itemData.name}</Typography>
            </Box>
        case "actors":
            const actor = item as ActorData;
            return (
                <Box paddingX={1}>
                    <Typography>{actor.name}</Typography>
                    {actor.isPlayer && <Typography><b>PLAYER CHARACTER</b></Typography>}
                    <Typography>starts in: {actor.room ?? '[nowhere]'}</Typography>
                </Box>
            )
        case "conversations":
            const conversation = item as Conversation;
            const branches = Object.values(conversation.branches);
            const choices = branches.flatMap(branch => branch?.choices || [])
            return <Box paddingX={1}>
                <Typography>x{branches.length} branches</Typography>
                <Typography>x{choices.length} choices</Typography>
            </Box>
        case "sprites":
            const spriteData = item as SpriteData;
            const animationList = Object.keys(spriteData.animations);
            const displayText = truncateLine(animationList.join(", "), 130)
            return <Box paddingX={1}>
                <Typography>{displayText}</Typography>
            </Box>
        case "sequences": {
            const { description = '', stages, id } = item as Sequence;
            const descriptionText = description.trim().length > 0 ? truncateLine(description, 50) : '[no description]'
            return <Box paddingX={1}>
                <Typography>{descriptionText}</Typography>
                <Typography>x{stages.length} stages
                    {id === openingSequenceId && <b>{' '}OPENING SEQUENCE</b>}
                </Typography>
            </Box>
        }
        case "verbs":
            return null
        case "storyBoards": {
            const { isEndOfGame, pages, id } = item as StoryBoard;
            return <Box paddingX={1}>
                <Typography>x{pages.length} pages</Typography>
                {isEndOfGame && <Typography><b>ENDS GAME</b></Typography>}
                {id === openingStoryboardId && <Typography><b>TITLE SEQUENCE</b></Typography>}
            </Box>
        }
    }
}

const ItemInteraction = ({ item, designProperty }: { item: GameDataItem, designProperty: GameDataItemType }) => {
    const { id } = item
    if (designProperty === 'actors') {
        const { noInteraction } = item as ActorData
        return <InteractionsDialogsButton variant='text' disabled={noInteraction} criteria={i => i.targetId === id} newPartial={{ targetId: id }} />
    }
    if (designProperty === 'items') {
        return <InteractionsDialogsButton variant='text' criteria={i => i.targetId === id || i.itemId === id} newPartial={{ itemId: id }} />
    }
    return null
}

export const DataItemCard = <DataType extends GameDataItem,>({ attemptCreate, item, designProperty, itemTypeName }: Props<DataType>) => {
    const { gameDesign, openInEditor } = useGameDesign()
    const dataTypeArray = gameDesign[designProperty];

    function handleDuplicate(proposedId: string, item: GameDataItem): void {
        attemptCreate({ ...cloneData(item) as DataType, id: proposedId })
    }

    const getInputIdError = (input: string) => {
        if (dataTypeArray.some(item => item.id === input)) {
            return `${itemTypeName} "${input}" aleady exists.`
        }
        return undefined
    }

    return (
        <ConceptCard
            handleClick={() => openInEditor(designProperty, item.id)}
            palette="primary"
            title={item.id}
            Icon={tabIcons[designProperty]}
            actions={<>
                <ButtonWithTextInput
                    label={'copy'}
                    buttonProps={{
                        startIcon: <ContentCopyIcon />,
                    }}
                    getError={getInputIdError}
                    modifyInput={formatIdInput}
                    onEntry={(newId) => handleDuplicate(newId, item)}
                    dialogTitle={`Enter ${itemTypeName} id`}
                />
                <DeleteDataItemButton
                    buttonProps={{
                    }}
                    dataItem={item}
                    itemType={designProperty}
                    itemTypeName={itemTypeName}
                />
                <ItemInteraction item={item} designProperty={designProperty} />
            </>}
        >
            <Box display={'flex'} gap={2} alignItems={'center'} justifyContent="space-between">
                <ItemDetails item={item} designProperty={designProperty} />
                <ItemPreview item={item} designProperty={designProperty} />
            </Box>
        </ConceptCard>
    )
}