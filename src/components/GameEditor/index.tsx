import { GameDesignProvider } from "@/context/game-design-context";
import { SpritesProvider } from "@/context/sprite-context";
import { prebuiltGameDesign } from '@/data/fullGame';
import { GameDesign, Interaction } from "@/definitions";
import { GameDataItem, GameDataItemType } from "@/definitions/Game";
import { Sprite } from "@/lib/Sprite";
import { cloneData } from "@/lib/clone";
import { changeOrAddInteraction, addGameDataItem } from "@/lib/mutate-design";
import { patchMember } from "@/lib/update-design";
import imageService from "@/services/imageService";
import { populateServicesForPreBuiltGame } from "@/services/populateServices";
import soundService from "@/services/soundService";
import { editorTheme } from "@/theme";
import { Box, Button, ButtonGroup, Container, IconButton, Stack, ThemeProvider } from "@mui/material";
import { Component } from "react";
import { TabId, tabOrder } from "../../lib/editor-config";
import { MainWindow } from "./MainWindow";
import { SaveLoadAndUndo } from "./SaveLoadAndUndo";
import { TestGameDialog } from "./TestGameDialog";
import { defaultVerbs1, getBlankRoom } from "./defaults";
import { PlayCircleFilledOutlinedIcon } from "./material-icons";


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
        this.createGameDataItem = this.createGameDataItem.bind(this)
        this.changeInteraction = this.changeInteraction.bind(this)
        this.deleteArrayItem = this.deleteArrayItem.bind(this)
        this.loadNewGame = this.loadNewGame.bind(this)
        this.undo = this.undo.bind(this)
        this.openInEditor = this.openInEditor.bind(this)
        this.applyModification = this.applyModification.bind(this)
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

    deleteArrayItem(index: number, property: GameDataItemType | 'interactions') {
        // TO DO - check for references to the ID of the deleted item?
        console.log(`delete ${property}`)
        this.setState(state => {
            const { gameDesign } = state
            const history = this.historyUpdate(`delete ${property}`, state)
            gameDesign[property].splice(index, 1)
            return { gameDesign, history }
        })
    }
    changeInteraction(interaction: Interaction, index?: number) {
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
        const {
            gameDesign, tabOpen, gameItemIds, history,
        } = this.state
        const { createGameDataItem, deleteArrayItem, openInEditor, changeInteraction, applyModification } = this

        const sprites = [...gameDesign.sprites.map(data => new Sprite(data))]

        return (
            <ThemeProvider theme={editorTheme}>
                <GameDesignProvider value={{
                    gameDesign: this.state.gameDesign,
                    createGameDataItem,
                    deleteArrayItem,
                    openInEditor,
                    changeInteraction,
                    applyModification,
                    modifyRoom: (description, id, mod) => {
                        applyModification(description, { rooms: patchMember(id, mod, gameDesign.rooms) })
                    }
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
