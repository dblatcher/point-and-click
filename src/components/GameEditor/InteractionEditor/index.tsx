
import { SelectInput } from "@/components/SchemaForm/inputs";
import { GameDesign, Interaction } from "@/definitions";
import { cloneData } from "@/lib/clone";
import { listIds } from "@/lib/util";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button } from "@mui/material";
import { Component } from "react";
import { EditorHeading } from "../EditorHeading";
import { InteractionForm } from "./InteractionForm";
import { InteractionTableRow } from "./InteractionTableRow";
import { getItemDescriptions, getTargetLists } from "./getTargetLists";
import styles from './styles.module.css';

interface Props {
    gameDesign: GameDesign;
    changeInteraction: { (data: Interaction, index?: number): void };
    deleteInteraction: { (index: number): void };
    updateData: { (data: Interaction[]): void };
}

interface State {
    verbFilter?: string;
    itemFilter?: string;
    targetFilter?: string;
    roomFilter?: string;
    interactionUnderConstruction?: Partial<Interaction>;
    edittedIndex?: number;
}


export class InteractionEditor extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            interactionUnderConstruction: undefined,
        }
        this.saveInteraction = this.saveInteraction.bind(this)
        this.changeOrder = this.changeOrder.bind(this)
    }

    get filteredInteractions(): Interaction[] {
        const { interactions } = this.props.gameDesign
        const { verbFilter, itemFilter, targetFilter, roomFilter } = this.state

        let list = [...interactions]

        if (verbFilter) {
            list = list.filter(interaction => interaction.verbId === verbFilter)
        }
        if (itemFilter) {
            list = list.filter(interaction => interaction.itemId === itemFilter)
        }
        if (targetFilter) {
            list = list.filter(target => target.targetId === targetFilter)
        }
        if (roomFilter) {
            list = list.filter(target => target.roomId === roomFilter)
        }
        return list
    }

    get filteredTargets(): {
        ids: string[]; descriptions: string[];
    } {
        const { gameDesign } = this.props
        const interactions = this.filteredInteractions
        const targetLists = getTargetLists(gameDesign)
        const ids: string[] = []
        const descriptions: string[] = []

        targetLists.ids.forEach((id, index) => {
            if (interactions.some(interaction => interaction.targetId === id)) {
                ids.push(id)
                descriptions.push(targetLists.descriptions[index])
            }
        })
        return { ids, descriptions }
    }

    saveInteraction(interaction: Interaction) {
        const { edittedIndex } = this.state
        const { changeInteraction } = this.props

        changeInteraction(interaction, edittedIndex)
        this.setState({
            edittedIndex: undefined,
            interactionUnderConstruction: undefined,
        })
    }

    changeOrder(index: number, direction: 'down' | 'up') {
        const { updateData, gameDesign } = this.props
        const { interactions } = gameDesign
        const endPlace = interactions.length - 1;
        const list = [...interactions]

        const [movedItem] = list.splice(index, 1)
        const newPlace = direction === 'down'
            ? index < endPlace ? index + 1 : 0
            : index > 0 ? index - 1 : endPlace

        list.splice(newPlace, 0, movedItem)
        return updateData(list)
    }

    render() {
        const { gameDesign } = this.props
        const { interactions, verbs, items, rooms } = gameDesign
        const { verbFilter = '', itemFilter = '', targetFilter = '', roomFilter = '', interactionUnderConstruction, edittedIndex } = this.state
        const { filteredInteractions, filteredTargets } = this

        return (
            <article>
                <EditorHeading heading="Interactions" />
                <table className={styles.interactionTable}>
                    <caption>
                        <span>{filteredInteractions.length}/{interactions.length} interactions</span>
                    </caption>
                    <thead>
                        <tr>
                            <th>verb</th>
                            <th>target</th>
                            <th>item</th>
                            <th>room</th>
                            <th rowSpan={2}>consequences</th>
                            <th rowSpan={2} style={{ width: '4em' }}>must be true</th>
                            <th rowSpan={2} style={{ width: '4em' }}>must be false</th>
                        </tr>
                        <tr>
                            <th>
                                <Box minWidth={80}>
                                    <SelectInput
                                        optional
                                        inputHandler={verbFilter => { this.setState({ verbFilter }) }}
                                        value={verbFilter}
                                        options={listIds(verbs)} />
                                </Box>
                            </th>
                            <th>
                                <Box minWidth={80}>
                                    <SelectInput
                                        optional
                                        inputHandler={targetFilter => { this.setState({ targetFilter }) }}
                                        value={targetFilter}
                                        options={filteredTargets.ids}
                                        descriptions={filteredTargets.descriptions}
                                    />
                                </Box>
                            </th>
                            <th>
                                <Box minWidth={80}>
                                    <SelectInput
                                        optional
                                        inputHandler={itemFilter => { this.setState({ itemFilter }) }}
                                        value={itemFilter}
                                        options={listIds(items)}
                                        descriptions={getItemDescriptions(gameDesign)} />
                                </Box>
                            </th>
                            <th>
                                <Box minWidth={80}>
                                    <SelectInput
                                        optional
                                        inputHandler={roomFilter => { this.setState({ roomFilter }) }}
                                        value={roomFilter}
                                        options={listIds(rooms)} />
                                </Box>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {interactions.map((interaction, index) => {
                            if (!filteredInteractions.includes(interaction)) { return <></> }
                            return (<InteractionTableRow key={index}
                                interaction={interaction}
                                index={index}
                                changeOrder={this.changeOrder}
                                deleteInteraction={this.props.deleteInteraction}
                                openEditor={() => this.setState({ edittedIndex: index, interactionUnderConstruction: cloneData(interaction) })}
                            />)
                        })}
                    </tbody>
                </table>

                <Box display='flex' justifyContent='flex-end' paddingTop={2}>
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
                    <InteractionForm key={edittedIndex}
                        confirm={this.saveInteraction}
                        gameDesign={this.props.gameDesign}
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