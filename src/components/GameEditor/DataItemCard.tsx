import { ContentCopyIcon, EditIcon, HideImageOutlinedIcon } from "@/components/GameEditor/material-icons";
import { useGameDesign } from "@/context/game-design-context";
import { useSprites } from "@/context/sprite-context";
import { ActorData, GameDataItem, ItemData, RoomData, SpriteData } from "@/definitions";
import { GameDataItemType } from "@/definitions/Game";
import { StoryBoard } from "@/definitions/StoryBoard";
import { cloneData } from "@/lib/clone";
import { tabIcons } from "@/lib/editor-config";
import { buildActorData } from "@/lib/sprite-to-actor";
import { findById } from "@/lib/util";
import { Box, BoxProps, Button, ButtonGroup } from "@mui/material";
import { StoryPageDisplay } from "../storyboard/StoryPageDisplay";
import { ButtonWithTextInput } from "./ButtonWithTextInput";
import { ConceptCard } from "./ConceptCard";
import { DeleteDataItemButton } from "./DeleteDataItemButton";
import { FramePreview } from "./FramePreview";
import { formatIdInput } from "./helpers";
import { InteractionsDialogsButton } from "./InteractionsDialogsButton";
import { RoomLocationPicker } from "./RoomLocationPicker";
import { SpritePreview } from "./SpritePreview";

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

const hasPreview = (designProperty: GameDataItemType) => ['rooms', 'actors', 'sprites', 'items', 'stroyboards'].includes(designProperty)

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
                ? <FramePreview frame={{ imageId, row, col }} height={50} width={50} />
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

const ItemInteraction = ({ item, designProperty }: { item: GameDataItem, designProperty: GameDataItemType }) => {
    const { id } = item
    if (designProperty === 'actors') {
        const { noInteraction } = item as ActorData
        return <InteractionsDialogsButton disabled={noInteraction} criteria={i => i.targetId === id} newPartial={{ targetId: id }} />
    }
    if (designProperty === 'items') {
        return <InteractionsDialogsButton criteria={i => i.targetId === id || i.itemId === id} newPartial={{ itemId: id }} />
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
            palette="primary"
            title={item.id}
            Icon={tabIcons[designProperty]}
        >
            <Box display={'flex'} padding={2} gap={2} alignItems={'center'}>
                <ItemPreview item={item} designProperty={designProperty} />
                <ButtonGroup orientation="vertical">
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => openInEditor(designProperty, item.id)}>edit</Button>
                    <ItemInteraction item={item} designProperty={designProperty} />
                </ButtonGroup>
                <ButtonGroup orientation= {hasPreview(designProperty) ?  "vertical": 'horizontal'}>
                    <ButtonWithTextInput
                        label={'copy'}
                        buttonProps={{
                            startIcon: <ContentCopyIcon />,
                            variant: 'outlined',
                        }}
                        getError={getInputIdError}
                        modifyInput={formatIdInput}
                        onEntry={(newId) => handleDuplicate(newId, item)}
                        dialogTitle={`Enter ${itemTypeName} id`}
                    />
                    <DeleteDataItemButton
                        buttonProps={{
                            variant: 'outlined',
                        }}
                        dataItem={item}
                        itemType={designProperty}
                        itemTypeName={itemTypeName}
                    />
                </ButtonGroup>
            </Box>
        </ConceptCard>
    )
}