
import { SelectInput } from "@/components/SchemaForm/inputs";
import { GameDesign, Interaction } from "@/definitions";
import { cloneData } from "@/lib/clone";
import { listIds } from "@/lib/util";
import { AddIcon } from "@/components/GameEditor/material-icons";
import { Box, Button, Paper, Table, TableContainer, TableBody, TableHead, TableRow, TableCell, Typography } from "@mui/material";
import { Component, Fragment } from "react";
import { EditorHeading } from "../EditorHeading";
import { InteractionDialog } from "./InteractionDialog";
import { InteractionTableRow } from "./InteractionTableRow";
import { getItemDescriptions, getTargetLists } from "./getTargetLists";
import { InteractionTableHeaders } from "./InteractionTableHeaders";


interface Props {
    gameDesign: GameDesign;
    changeInteraction: { (data: Interaction, index?: number): void };
    deleteInteraction: { (index: number): void };
    updateInteractionList: { (data: Interaction[]): void };
}

interface State {
    verbFilter?: string;
    itemFilter?: string;
    targetFilter?: string;
    roomFilter?: string;
    interactionUnderConstruction?: Partial<Interaction>;
    edittedIndex?: number;
}


const doesMatchFilters = (
    verbFilter?: string,
    itemFilter?: string,
    targetFilter?: string,
    roomFilter?: string
) => (interaction: Interaction): boolean => {
    if (verbFilter && interaction.verbId !== verbFilter) {
        return false
    }
    if (itemFilter && interaction.itemId !== itemFilter) {
        return false
    }
    if (targetFilter && interaction.targetId !== targetFilter) {
        return false
    }
    if (roomFilter && interaction.roomId !== roomFilter) {
        return false
    }
    return true
}

const getFilteredTargets = (
    filteredInteractions: Interaction[],
    targetLists: { ids: string[]; descriptions: string[]; }
): {
    ids: string[]; descriptions: string[];
} => {
    const ids: string[] = []
    const descriptions: string[] = []

    targetLists.ids.forEach((id, index) => {
        if (filteredInteractions.some(interaction => interaction.targetId === id)) {
            ids.push(id)
            descriptions.push(targetLists.descriptions[index])
        }
    })
    return { ids, descriptions }
}

export class InteractionEditor extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            interactionUnderConstruction: undefined,
        }
    }

    render() {
        const { gameDesign, updateInteractionList } = this.props
        const { interactions, verbs, items, rooms } = gameDesign
        const { verbFilter = '', itemFilter = '', targetFilter = '', roomFilter = '', interactionUnderConstruction, edittedIndex } = this.state

        const filteredInteractions = interactions.filter(doesMatchFilters(verbFilter, itemFilter, targetFilter, roomFilter))
        const filteredTargets = getFilteredTargets(filteredInteractions, getTargetLists(gameDesign))

        const saveInteraction = (interaction: Interaction) => {
            const { edittedIndex } = this.state
            const { changeInteraction } = this.props

            changeInteraction(interaction, edittedIndex)
            this.setState({
                edittedIndex: undefined,
                interactionUnderConstruction: undefined,
            })
        }

        const moveInteractionInList = (index: number, direction: 'down' | 'up') => {
            const { interactions } = gameDesign
            const endPlace = interactions.length - 1;
            const list = [...interactions]

            const [movedItem] = list.splice(index, 1)
            const newPlace = direction === 'down'
                ? index < endPlace ? index + 1 : 0
                : index > 0 ? index - 1 : endPlace

            list.splice(newPlace, 0, movedItem)
            return updateInteractionList(list)
        }

        return (
            <article>
                <EditorHeading heading="Interactions" />
                <TableContainer component={Paper}>
                    <Table size="small" padding="normal" sx={{ captionSide: 'top' }}>
                        <caption>
                            <Typography>Showing {filteredInteractions.length}/{interactions.length} interactions</Typography>
                        </caption>
                        <TableHead>
                            <InteractionTableHeaders />
                            <TableRow>
                                <TableCell>
                                    <Box minWidth={80}>
                                        <SelectInput
                                            optional
                                            inputHandler={verbFilter => { this.setState({ verbFilter }) }}
                                            value={verbFilter}
                                            options={listIds(verbs)} />
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box minWidth={80}>
                                        <SelectInput
                                            optional
                                            inputHandler={targetFilter => { this.setState({ targetFilter }) }}
                                            value={targetFilter}
                                            options={filteredTargets.ids}
                                            descriptions={filteredTargets.descriptions}
                                        />
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box minWidth={80}>
                                        <SelectInput
                                            optional
                                            inputHandler={itemFilter => { this.setState({ itemFilter }) }}
                                            value={itemFilter}
                                            options={listIds(items)}
                                            descriptions={getItemDescriptions(gameDesign)} />
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box minWidth={80}>
                                        <SelectInput
                                            optional
                                            inputHandler={roomFilter => { this.setState({ roomFilter }) }}
                                            value={roomFilter}
                                            options={listIds(rooms)} />
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {interactions.map((interaction, index) => {
                                if (!filteredInteractions.includes(interaction)) { return <Fragment key={index} /> }
                                return (<InteractionTableRow key={index}
                                    interaction={interaction}
                                    index={index}
                                    changeOrder={moveInteractionInList}
                                    deleteInteraction={this.props.deleteInteraction}
                                    openEditor={() => this.setState({ edittedIndex: index, interactionUnderConstruction: cloneData(interaction) })}
                                />)
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>


                <Box display='flex' justifyContent='flex-end' paddingY={2}>
                    <Button
                        size="large"
                        onClick={() =>
                            this.setState({
                                edittedIndex: undefined,
                                interactionUnderConstruction: {}
                            })}
                        variant="contained"
                        startIcon={<AddIcon />}
                    >
                        Add new Interaction
                    </Button>
                </Box>

                {interactionUnderConstruction &&
                    <InteractionDialog key={edittedIndex}
                        confirm={saveInteraction}
                        initialState={interactionUnderConstruction}
                        cancelFunction={() => {
                            this.setState({
                                edittedIndex: undefined,
                                interactionUnderConstruction: undefined
                            })
                        }}
                    />
                }
            </article>
        )
    }
}