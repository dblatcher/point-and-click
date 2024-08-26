import { GameDesignProvider } from "@/context/game-design-context";
import { SpritesProvider } from "@/context/sprite-context";
import { prebuiltGameDesign } from '@/data/fullGame';
import { GameDataItem, GameDesign, Interaction, Verb } from "@/definitions";
import { FlagMap } from "@/definitions/Flag";
import { GameDataItemType } from "@/definitions/Game";
import { Sprite } from "@/lib/Sprite";
import { cloneData } from "@/lib/clone";
import { findIndexById } from "@/lib/util";
import imageService from "@/services/imageService";
import { populateServicesForPreBuiltGame } from "@/services/populateServices";
import { editorTheme } from "@/theme";
import { Box, Button, ButtonGroup, Container, IconButton, Stack, ThemeProvider } from "@mui/material";
import { Component } from "react";
import { TabId, tabOrder } from "../../lib/editor-config";
import { MainWindow } from "./MainWindow";
import { SaveLoadAndUndo } from "./SaveLoadAndUndo";
import { TestGameDialog } from "./TestGameDialog";
import { defaultVerbs1, getBlankRoom } from "./defaults";
import { PlayCircleFilledOutlinedIcon } from "./material-icons";
import soundService from "@/services/soundService";


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

function addNewOrUpdate<T extends GameDataItem>(newData: unknown, list: T[]): T[] {
    const newItem = newData as T;
    const matchIndex = findIndexById(newItem.id, list)
    if (matchIndex !== -1) {
        list.splice(matchIndex, 1, newItem)
    } else {
        list.push(newItem)
    }
    return list
}

export default class GameEditor extends Component<Props, State> {

    constructor(props: Props) {
        super(props)

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

        this.respondToServiceUpdate = this.respondToServiceUpdate.bind(this)
        this.performUpdate = this.performUpdate.bind(this)
        this.changeInteraction = this.changeInteraction.bind(this)
        this.deleteArrayItem = this.deleteArrayItem.bind(this)
        this.loadNewGame = this.loadNewGame.bind(this)
        this.undo = this.undo.bind(this)
        this.openInEditor = this.openInEditor.bind(this)
    }

    respondToServiceUpdate(payload: unknown) {
        console.log('service update', { payload })
        this.forceUpdate()
    }

    componentDidMount() {
        imageService.removeAll()
        soundService.removeAll()
        if (this.props.usePrebuiltGame) {
            populateServicesForPreBuiltGame()
        }
        imageService.on('update', this.respondToServiceUpdate)
    }

    componentWillUnmount() {
        imageService.off('update', this.respondToServiceUpdate)
    }

    performUpdate(property: keyof GameDesign, data: unknown) {
        console.log(property, data)

        this.setState(state => {
            const { gameDesign, gameItemIds, history } = state
            history.push({
                label: `update ${property}`,
                gameDesign: cloneData(gameDesign)
            })
            if (history.length > 10) { history.shift() }
            switch (property) {
                case 'rooms':
                case 'items':
                case 'actors':
                case 'conversations':
                case 'sprites':
                case 'sequences':
                case 'endings':
                    {
                        addNewOrUpdate(data, gameDesign[property] as GameDataItem[])
                        gameItemIds[property] = (data as GameDataItem).id
                        break
                    }
                case 'verbs':
                    {
                        if (Array.isArray(data)) {
                            gameDesign[property] = data as Verb[]
                        } else {
                            addNewOrUpdate(data, gameDesign[property])
                            gameItemIds[property] = (data as GameDataItem).id
                        }
                        break
                    }
                case 'interactions':
                    {
                        if (Array.isArray(data)) {
                            gameDesign.interactions = data as Interaction[]
                        }
                        break
                    }
                case 'flagMap': {
                    gameDesign.flagMap = (data as FlagMap)
                    break
                }
                case 'id':
                case 'currentRoomId': {
                    gameDesign[property] = data as string
                    break
                }
                case 'openingSequenceId': {
                    if (data === '' || typeof data === 'undefined') {
                        gameDesign[property] = undefined
                    } else {
                        gameDesign[property] = data as string
                    }
                    break
                }
            }
            return { gameDesign, gameItemIds }
        })
    }

    deleteArrayItem(index: number, property: keyof GameDesign) {
        // TO DO - check for references to the ID of the deleted item?
        this.setState(state => {
            const { gameDesign, history } = state
            history.push({
                label: `delete ${property}`,
                gameDesign: cloneData(gameDesign)
            })
            if (Array.isArray(gameDesign[property])) {
                const [deletedItem] = (gameDesign[property] as GameDataItem[]).splice(index, 1)
            }
            return { gameDesign, history }
        })
    }
    changeInteraction(data: Interaction, index?: number) {
        this.setState(state => {
            const { gameDesign, history } = state
            history.push({
                label: `change interaction`,
                gameDesign: cloneData(gameDesign)
            })
            const { interactions } = gameDesign
            if (typeof index === 'undefined') {
                interactions.push(data)
            } else {
                interactions.splice(index, 1, data)
            }
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
        const {
            gameDesign, tabOpen, gameItemIds, history,
        } = this.state
        const { performUpdate, deleteArrayItem, openInEditor, changeInteraction } = this

        const sprites = [...gameDesign.sprites.map(data => new Sprite(data))]

        return (
            <ThemeProvider theme={editorTheme}>
                <GameDesignProvider value={{
                    gameDesign: this.state.gameDesign,
                    performUpdate,
                    deleteArrayItem,
                    openInEditor,
                    changeInteraction,
                }} >
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
                                    />
                                    <IconButton
                                        onClick={() => { this.setState({ gameTestDialogOpen: true, resetTimeStamp: Date.now() }) }}
                                    >
                                        <PlayCircleFilledOutlinedIcon fontSize={'large'} />
                                    </IconButton>
                                </Stack>
                                <ButtonGroup orientation="vertical">
                                    {tabOrder.map((tab, index) => (
                                        <Button key={tab.id} size="small"
                                            variant={tab.id === tabOpen ? 'contained' : 'outlined'}
                                            onClick={() => { openInEditor(tab.id) }}
                                            startIcon={<span>{index + 1}</span>}
                                        >{tab.label}</Button>
                                    ))}
                                </ButtonGroup>
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
                </GameDesignProvider>
            </ThemeProvider>
        )
    }
}
