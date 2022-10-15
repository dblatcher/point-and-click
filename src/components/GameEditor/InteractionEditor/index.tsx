/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h, Fragment } from "preact";
import { GameDesign, Interaction } from "src";
import { DeleteButton, SelectInput } from "../formControls";
import editorStyles from '../editorStyles.module.css';
import { cloneData } from "../../../lib/clone";
import { InteractionForm } from "./InteractionForm";
import { getTargetLists, getItemDescriptions } from "./getTargetLists";

interface Props {
    gameDesign: GameDesign;
    changeInteraction: { (data: Interaction, index?: number): void };
    deleteInteraction: { (index: number): void };
}

interface State {
    verbFilter?: string;
    itemFilter?: string;
    targetFilter?: string;
    roomFilter?: string;
    interactionUnderConstruction?: Partial<Interaction>;
    edittedIndex?: number;
}

function listIds<T extends { id: string }>(list: T[]): string[] {
    return list.map(_ => _.id)
}

export class InteractionEditor extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            interactionUnderConstruction: undefined,
        }
        this.saveInteraction = this.saveInteraction.bind(this)
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

    saveInteraction(interaction: Interaction) {
        const { edittedIndex } = this.state
        const { changeInteraction } = this.props

        changeInteraction(interaction, edittedIndex)
        this.setState({
            edittedIndex: undefined,
            interactionUnderConstruction: undefined,
        })
    }

    renderFlagConditions(interaction: Interaction) {
        const { flagsThatMustBeFalse, flagsThatMustBeTrue } = interaction
        if (!flagsThatMustBeFalse && !flagsThatMustBeTrue) {
            return <span>none</span>
        }



        return <>
            {flagsThatMustBeFalse?.map((flag, index) => (<b key={index}>![{flag}]</b>))}
            {flagsThatMustBeTrue?.map((flag, index) => (<b key={index}>[{flag}]</b>))}
        </>
    }

    render() {
        const { gameDesign } = this.props
        const { interactions, verbs, items, rooms } = gameDesign
        const { verbFilter = '', itemFilter = '', targetFilter = '', roomFilter = '', interactionUnderConstruction, edittedIndex } = this.state
        const { filteredInteractions } = this
        const targetLists = getTargetLists(gameDesign)

        return (
            <article>
                <h2>Interactions</h2>
                <table className={editorStyles.interactionTable} style={{ display: interactionUnderConstruction ? 'none' : 'table' }}>
                    <caption>{filteredInteractions.length}/{interactions.length} interactions</caption>
                    <thead>
                        <tr>
                            <td>verb</td>
                            <td>target</td>
                            <td>item</td>
                            <td>room</td>
                            <td rowSpan={2}>consequences</td>
                            <td rowSpan={2}>Flag conditions</td>
                        </tr>
                        <tr>
                            <td>
                                <SelectInput
                                    haveEmptyOption={true}
                                    onSelect={verbFilter => { this.setState({ verbFilter }) }}
                                    emptyOptionLabel="[ANY VERB]"
                                    value={verbFilter}
                                    items={listIds(verbs)} />
                            </td>
                            <td>
                                <SelectInput
                                    haveEmptyOption={true}
                                    onSelect={targetFilter => { this.setState({ targetFilter }) }}
                                    emptyOptionLabel="[ANY Target]"
                                    value={targetFilter}
                                    items={targetLists.ids}
                                    descriptions={targetLists.descriptions}
                                />
                            </td>
                            <td>
                                <SelectInput
                                    haveEmptyOption={true}
                                    onSelect={itemFilter => { this.setState({ itemFilter }) }}
                                    emptyOptionLabel="[ANY ITEM]"
                                    value={itemFilter}
                                    items={listIds(items)}
                                    descriptions={getItemDescriptions(gameDesign)} />
                            </td>
                            <td>
                                <SelectInput
                                    haveEmptyOption={true}
                                    onSelect={roomFilter => { this.setState({ roomFilter }) }}
                                    emptyOptionLabel="[ANY ROOM]"
                                    value={roomFilter}
                                    items={listIds(rooms)} />
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {interactions.map((interaction, index) => {
                            return filteredInteractions.includes(interaction)
                                ? (
                                    <tr key={index}>
                                        <td>{interaction.verbId}</td>
                                        <td>
                                            <span>{interaction.targetId}</span>
                                            {interaction.targetStatus && <span>({interaction.targetStatus})</span>}
                                        </td>
                                        <td>{interaction.itemId}</td>
                                        <td>{interaction.roomId}</td>
                                        <td>{interaction.consequences.length}x consequences</td>
                                        <td>{this.renderFlagConditions(interaction)}</td>
                                        <td><DeleteButton label="delete" confirmationText="really?" onClick={() => { this.props.deleteInteraction(index) }} /></td>
                                        <td><button onClick={() => this.setState({ edittedIndex: index, interactionUnderConstruction: cloneData(interaction) })}>edit</button></td>
                                    </tr>
                                )
                                : <></>
                        })}
                        <tr>
                            <td colSpan={10}>
                                <button onClick={() =>
                                    this.setState({
                                        edittedIndex: undefined,
                                        interactionUnderConstruction: {}
                                    })
                                }>add new interaction</button>
                            </td>
                        </tr>
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