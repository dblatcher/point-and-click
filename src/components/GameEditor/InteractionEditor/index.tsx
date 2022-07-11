/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import { GameCondition } from "../../../definitions/Game";
import { Interaction } from "../../../definitions/Interaction";
import { SelectInput } from "../formControls";
import styles from '../editorStyles.module.css';

interface Props {
    gameDesign: Omit<GameCondition, 'characterOrders' | 'sequenceRunning'>;
}

interface State {
    interaction?: Interaction;
    verbFilter?: string;
    itemFilter?: string;
    targetFilter?: string;
    roomFilter?: string;
}

function listIds<T extends { id: string }>(list: T[]): string[] {
    return list.map(_ => _.id)
}

export class InteractionEditor extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
        }
    }

    get filteredInteractions(): Interaction[] {
        const { interactions } = this.props.gameDesign
        const { verbFilter, itemFilter, targetFilter,roomFilter } = this.state

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

    get targetLists(): { ids: string[]; descriptions: string[] } {
        const { characters, items, rooms } = this.props.gameDesign
        const ids: string[] = [];
        const descriptions: string[] = [];

        characters.forEach(character => {
            ids.push(character.id)
            descriptions.push(`🚶 ${character.id}`)
        })
        items.forEach(item => {
            ids.push(item.id)
            descriptions.push(`🎒 ${item.id}`)
        })
        rooms.forEach(room => {
            room.hotspots?.forEach(hotspot => {
                ids.push(hotspot.id)
                descriptions.push(`⌘${hotspot.id} (${room.id})`)
            })
        })
        return { ids, descriptions }
    }

    render() {

        const { interactions, verbs, items, rooms } = this.props.gameDesign
        const { verbFilter = '', itemFilter = '', targetFilter = '', roomFilter = '' } = this.state
        const { filteredInteractions, targetLists } = this
        return (
            <article>
                <h2>Interactions</h2>
                <p>{interactions.length} interactions</p>
                <table className={styles.interactionTable}>
                    <thead>
                        <tr>
                            <td>verb</td>
                            <td>target</td>
                            <td>item</td>
                            <td>room</td>
                            <td rowSpan={2}>consequences</td>
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
                                    items={listIds(items)} />
                            </td>
                            <td>
                                <SelectInput
                                    haveEmptyOption={true}
                                    onSelect={roomFilter => { this.setState({ roomFilter }) }}
                                    emptyOptionLabel="[ANY room]"
                                    value={roomFilter}
                                    items={listIds(rooms)} />
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInteractions.map((interaction, index) => (
                            <tr key={index}>
                                <td>{interaction.verbId}</td>
                                <td>
                                    <span>{interaction.targetId}</span>
                                    {interaction.targetStatus && <span>({interaction.targetStatus})</span>}
                                </td>
                                <td>{interaction.itemId}</td>
                                <td>{interaction.roomId}</td>
                                <td>{interaction.consequences.length}x consequences</td>
                            </tr>
                        ))}
                    </tbody>
                </table>



            </article >
        )
    }
}