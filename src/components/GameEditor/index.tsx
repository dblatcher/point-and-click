import { GameDesignProvider } from "@/context/game-design-context";
import { SpritesProvider } from "@/context/sprite-context";
import { prebuiltGameDesign } from '@/data/fullGame';
import { GameDesign, Interaction } from "@/definitions";
import { GameDataItem, GameDataItemType } from "@/definitions/Game";
import { Sprite } from "@/lib/Sprite";
import { cloneData } from "@/lib/clone";
import { addGameDataItem, changeOrAddInteraction } from "@/lib/mutate-design";
import { patchMember } from "@/lib/update-design";
import { ImageService } from "@/services/imageService";
import { populateServicesForPreBuiltGame } from "@/services/populateServices";
import { SoundService } from "@/services/soundService";
import { editorTheme } from "@/theme";
import { Box, Container, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, ThemeProvider } from "@mui/material";
import { Component } from "react";
import { TabId, tabOrder } from "../../lib/editor-config";
import { MainWindow } from "./MainWindow";
import { SaveLoadAndUndo } from "./SaveLoadAndUndo";
import { TestGameDialog } from "./TestGameDialog";
import { defaultVerbs1, getBlankRoom } from "./defaults";
import { PlayCircleFilledOutlinedIcon } from "./material-icons";
import { AssetsProvider } from "@/context/asset-context";


type State = {
    gameDesign: GameDesign;
    tabOpen: TabId;
    gameItemIds: Partial<Record<GameDataItemType, string>>;
    resetTimeStamp: number;
    history: { gameDesign: GameDesign; label: string }[];
    undoTime: number;
    gameTestDialogOpen: boolean;
};

export type Props = {
    usePrebuiltGame?: boolean;
}


const defaultRoomId = 'ROOM_1' as const;

export default class GameEditor extends Component<Props, State> {
    imageService: ImageService
    soundService: SoundService

    constructor(props: Props) {
        super(props)
        this.soundService = new SoundService()
        this.imageService = new ImageService()
        const gameDesign = props.usePrebuiltGame ? { ...prebuiltGameDesign } : {
            id: "NEW_GAME",
            rooms: [Object.assign(getBlankRoom(), { id: defaultRoomId, height: 150 })],
            actors: [],
            interactions: [],
            items: [],
            conversations: [],
            verbs: defaultVerbs1(),
            currentRoomId: defaultRoomId,
            sequences: [],
            sprites: [],
            endings: [],
            flagMap: {},
        };

        this.state = {
            gameDesign,
            tabOpen: 'main',
            gameItemIds: {},
            resetTimeStamp: 0,
            history: [],
            undoTime: 0,
            gameTestDialogOpen: false,
        }

        this.createGameDataItem = this.createGameDataItem.bind(this)
        this.changeOrAddInteraction = this.changeOrAddInteraction.bind(this)
        this.deleteArrayItem = this.deleteArrayItem.bind(this)
        this.deleteInteraction = this.deleteInteraction.bind(this)
        this.loadNewGame = this.loadNewGame.bind(this)
        this.undo = this.undo.bind(this)
        this.openInEditor = this.openInEditor.bind(this)
        this.applyModification = this.applyModification.bind(this)
    }

    componentDidMount() {
        if (this.props.usePrebuiltGame) {
            populateServicesForPreBuiltGame(this.imageService, this.soundService)
        }
    }

    historyUpdate(label: string, state: State) {
        const { gameDesign, history } = state
        history.push({
            label,
            gameDesign: cloneData(gameDesign)
        })
        if (history.length > 10) { history.shift() }
        return history
    }

    createGameDataItem(property: GameDataItemType, data: GameDataItem) {
        console.log(property, data)
        this.setState(state => {
            const { gameDesign } = state
            const history = this.historyUpdate(`update ${property}`, state)
            addGameDataItem(gameDesign, property, data)
            return { gameDesign, history }
        })
    }

    applyModification(description: string, mod: Partial<GameDesign>) {
        console.log(description)
        this.setState(state => {
            const history = this.historyUpdate(description, state)
            return { gameDesign: { ...state.gameDesign, ...mod }, history }
        })
    }

    deleteArrayItem(index: number, property: GameDataItemType) {
        // TO DO - check for references to the ID of the deleted item?
        const message = `delete "${this.state.gameDesign[property][index]?.id}" from ${property}`
        console.log(message)
        this.setState(state => {
            const { gameDesign } = state
            const history = this.historyUpdate(message, state)
            gameDesign[property].splice(index, 1)
            return { gameDesign, history }
        })
    }
    deleteInteraction(index: number) {
        const interactionToDelete = this.state.gameDesign.interactions[index]
        if (!interactionToDelete) {
            return
        }
        const { verbId, targetId, itemId = '[no item]' } = interactionToDelete
        this.setState(state => {
            const { gameDesign } = state
            const history = this.historyUpdate(
                `delete interaction #${index}: ${verbId} ${targetId} (${itemId})`
                , state
            )
            gameDesign.interactions.splice(index, 1)
            return { gameDesign, history }
        })
    }
    changeOrAddInteraction(interaction: Interaction, index?: number) {
        this.setState(state => {
            const { gameDesign } = state
            const history = this.historyUpdate(`change interaction`, state)
            changeOrAddInteraction(gameDesign, interaction, index)
            return { gameDesign, history }
        })
    }
    loadNewGame(gameDesign: GameDesign) {
        this.setState({ gameDesign })
    }
    undo() {
        this.setState(state => {
            const { history } = state
            const historyItem = history.pop()
            if (!historyItem) { return {} }
            return {
                ...state,
                history,
                gameDesign: historyItem.gameDesign,
                undoTime: Date.now()
            }
        })
    }

    openInEditor(tabType: TabId, itemId?: string) {
        this.setState(state => {
            const { gameItemIds } = state
            switch (tabType) {
                case 'rooms':
                case 'items':
                case 'actors':
                case 'conversations':
                case 'sprites':
                case 'sequences':
                case 'endings':
                case 'verbs':
                    gameItemIds[tabType] = itemId
                    break;
            }
            return { gameItemIds, tabOpen: tabType }
        })
    }

    render() {
        const { soundService, imageService } = this
        const {
            gameDesign, tabOpen, gameItemIds, history,
        } = this.state
        const { createGameDataItem, deleteArrayItem, openInEditor, changeOrAddInteraction, applyModification, deleteInteraction } = this

        const sprites = [...gameDesign.sprites.map(data => new Sprite(data, imageService.get.bind(imageService)))]

        return (
            <ThemeProvider theme={editorTheme}>
                <GameDesignProvider value={{
                    gameDesign: this.state.gameDesign,
                    createGameDataItem,
                    deleteArrayItem,
                    openInEditor,
                    changeOrAddInteraction,
                    deleteInteraction,
                    applyModification,
                    modifyRoom: (description, id, mod) => {
                        applyModification(description, { rooms: patchMember(id, mod, gameDesign.rooms) })
                    }
                }} >
                    <AssetsProvider imageService={imageService} soundService={soundService}>
                        <SpritesProvider value={sprites}>
                            <Container maxWidth='xl'
                                component={'main'}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    overflow: 'hidden',
                                    flex: 1,
                                    gap: 5,
                                    background: 'white',
                                }}>

                                <Stack
                                    component={'nav'}
                                    spacing={1}
                                    width={150}
                                >
                                    <Stack direction={'row'} marginTop={3} spacing={3} minHeight={35}>
                                        <SaveLoadAndUndo
                                            gameDesign={gameDesign}
                                            loadNewGame={this.loadNewGame}
                                            history={history}
                                            undo={this.undo}
                                            soundService={soundService}
                                            imageService={imageService}
                                        />
                                        <IconButton
                                            onClick={() => { this.setState({ gameTestDialogOpen: true, resetTimeStamp: Date.now() }) }}
                                        >
                                            <PlayCircleFilledOutlinedIcon fontSize={'large'} />
                                        </IconButton>
                                    </Stack>

                                    <List disablePadding>
                                        {tabOrder.map((tab, index) => (
                                            <ListItem key={index} disableGutters disablePadding>
                                                <ListItemButton
                                                    onClick={() => { openInEditor(tab.id) }}
                                                    selected={tab.id === tabOpen}
                                                >
                                                    <ListItemText>{index + 1}</ListItemText>
                                                    <ListItemText>{tab.label}</ListItemText>
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Stack>

                                <Box component={'section'} flex={1} padding={1} sx={{ overflowY: 'auto' }}>
                                    <MainWindow
                                        gameItemIds={gameItemIds}
                                        tabOpen={tabOpen}
                                        openInEditor={openInEditor} />
                                </Box>

                                <TestGameDialog
                                    isOpen={this.state.gameTestDialogOpen}
                                    close={() => { this.setState({ gameTestDialogOpen: false }) }}
                                    reset={() => { this.setState({ resetTimeStamp: Date.now() }) }}
                                    resetTimeStamp={this.state.resetTimeStamp}
                                />

                            </Container>
                        </SpritesProvider>
                    </AssetsProvider>
                </GameDesignProvider>
            </ThemeProvider>
        )
    }
}
