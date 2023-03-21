/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component } from "react";
import { GameDesign, Interaction } from "src";
import { DeleteButton, SelectInput } from "../formControls";
import { cloneData } from "../../../../lib/clone";
import { listIds } from "../../../../lib/util";
import { InteractionForm } from "./InteractionForm";
import { getTargetLists, getItemDescriptions } from "./getTargetLists";
import editorStyles from '../editorStyles.module.css';
import styles from './styles.module.css';
import { icons } from "../dataEditors";
import { EditorHeading } from "../EditorHeading";

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
                <table className={styles.interactionTable} style={{ display: interactionUnderConstruction ? 'none' : 'table' }}>
                    <caption>
                        <span>{filteredInteractions.length}/{interactions.length} interactions</span>
                        <button
                            className={[editorStyles.button, editorStyles.plusButton].join(" ")}
                            onClick={() =>
                                this.setState({
                                    edittedIndex: undefined,
                                    interactionUnderConstruction: {}
                                })
                            }>add new interaction</button>
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
                                <SelectInput
                                    haveEmptyOption={true}
                                    onSelect={verbFilter => { this.setState({ verbFilter }) }}
                                    emptyOptionLabel="[ANY VERB]"
                                    value={verbFilter}
                                    items={listIds(verbs)} />
                            </th>
                            <th>
                                <SelectInput
                                    haveEmptyOption={true}
                                    onSelect={targetFilter => { this.setState({ targetFilter }) }}
                                    emptyOptionLabel="[ANY Target]"
                                    value={targetFilter}
                                    items={filteredTargets.ids}
                                    descriptions={filteredTargets.descriptions}
                                />
                            </th>
                            <th>
                                <SelectInput
                                    haveEmptyOption={true}
                                    onSelect={itemFilter => { this.setState({ itemFilter }) }}
                                    emptyOptionLabel="[ANY ITEM]"
                                    value={itemFilter}
                                    items={listIds(items)}
                                    descriptions={getItemDescriptions(gameDesign)} />
                            </th>
                            <th>
                                <SelectInput
                                    haveEmptyOption={true}
                                    onSelect={roomFilter => { this.setState({ roomFilter }) }}
                                    emptyOptionLabel="[ANY ROOM]"
                                    value={roomFilter}
                                    items={listIds(rooms)} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {interactions.map((interaction, index) => {

                            if (!filteredInteractions.includes(interaction)) { return <></> }
                            const {
                                verbId, targetId, targetStatus, itemId, roomId,
                                consequences, flagsThatMustBeFalse = [], flagsThatMustBeTrue = []
                            } = interaction

                            const trueFlagText = flagsThatMustBeTrue.length ? `x${flagsThatMustBeTrue.length}` : ''
                            const trueFlagTitle = flagsThatMustBeTrue.join(", ")

                            const falseFlagText = flagsThatMustBeFalse.length ? `x${flagsThatMustBeFalse.length}` : ''
                            const falseFlagTitle = flagsThatMustBeFalse.join(", ")

                            const consequenceText = consequences.length ? `x${consequences.length}` : 'empty'
                            const consequenceTitle = consequences.map(_ => _.type).join(", ")

                            return (
                                <tr key={index}>
                                    <td>{verbId}</td>
                                    <td>
                                        <span>{targetId}</span>
                                        {targetStatus && <span>({targetStatus})</span>}
                                    </td>
                                    <td>{itemId}</td>
                                    <td>{roomId}</td>
                                    <td className={styles.centered} title={consequenceTitle}>{consequenceText}</td>
                                    <td className={styles.centered} title={trueFlagTitle}>{trueFlagText}</td>
                                    <td className={styles.centered} title={falseFlagTitle}>{falseFlagText}</td>
                                    <td>
                                        <button
                                            className={[editorStyles.button].join(" ")}
                                            onClick={() => this.setState({ edittedIndex: index, interactionUnderConstruction: cloneData(interaction) })}>
                                            edit
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className={[editorStyles.button, editorStyles.moveButton].join(" ")}
                                            onClick={() => this.changeOrder(index, 'up')}
                                        >{icons.UP}</button>
                                    </td>
                                    <td>
                                        <button
                                            className={[editorStyles.button, editorStyles.moveButton].join(" ")}
                                            onClick={() => this.changeOrder(index, 'down')}
                                        >{icons.DOWN}</button>
                                    </td>
                                    <td>
                                        <DeleteButton label={icons.DELETE}
                                            className={[editorStyles.button, editorStyles.deleteButton].join(" ")}
                                            confirmationText="really?"
                                            onClick={() => { this.props.deleteInteraction(index) }} />
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                <section style={{ display: interactionUnderConstruction ? 'block' : 'none' }}>
                    <h3>edit</h3>

                    {interactionUnderConstruction &&
                        <InteractionForm key={edittedIndex}
                            confirm={this.saveInteraction}
                            gameDesign={this.props.gameDesign}
                            initialState={interactionUnderConstruction} />
                    }

                    <DeleteButton label="Cancel" confirmationText="really?"
                        onClick={() => {
                            this.setState({
                                edittedIndex: undefined,
                                interactionUnderConstruction: undefined
                            })
                        }} />
                </section>

            </article >
        )
    }
}