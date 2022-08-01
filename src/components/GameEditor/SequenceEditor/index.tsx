/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import { AnyConsequence, Consequence, GameDesign, Order, Sequence, Stage } from "src";
import { ImmediateConsequence, ImmediateConsequenceSchema } from "../../../definitions/Interaction";
import { cloneData } from "../../../lib/clone";
import { makeBlankSequence, makeBlankStage, makeNewConsequence } from "../defaults";
import { ConsequenceForm } from "../InteractionEditor/ConsequenceForm";
import { ListEditor } from "../ListEditor";
import { OrderForm } from "../OrderForm";
import { StorageMenu } from "../StorageMenu";
import styles from "../editorStyles.module.css"
import { StringInput } from "../formControls";

interface Props {
    gameDesign: GameDesign;
    sequenceId?: string;
    data?: Sequence;
    updateData: { (data: Sequence): void };
}

type ExtraState = {

}
type State = Sequence & ExtraState



export class SequenceEditor extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = this.initialState
        this.changeOrder = this.changeOrder.bind(this)
        this.changeConsequence = this.changeConsequence.bind(this)
        this.changeConsequenceList = this.changeConsequenceList.bind(this)
        this.renderStage = this.renderStage.bind(this)
    }

    get initialState(): Sequence {
        const { data } = this.props
        return data ? {
            ...cloneData(data)
        } : makeBlankSequence()
    }

    get currentData(): Sequence {
        const characterData = cloneData(this.state) as State;
        return characterData
    }

    changeOrder(order: Order, stageIndex: number, characterId: string, orderIndex: number) {
        this.setState(state => {
            const { stages } = state
            const characterOrders = stages[stageIndex]?.characterOrders
            if (!characterOrders) { return {} }
            const ordersForCharacter = characterOrders[characterId]
            if (!ordersForCharacter) { return {} }
            ordersForCharacter.splice(orderIndex, 1, order)
            return { stages }
        })
    }

    changeConsequence(consequence: Consequence, stageIndex: number, consequenceIndex: number) {
        const isImmediateConsequence = ImmediateConsequenceSchema.safeParse(consequence)
        if (!isImmediateConsequence.success) {
            console.warn('not immediate', consequence)
            return
        }

        this.setState(state => {
            const { stages } = state
            const immediateConsequences = stages[stageIndex]?.immediateConsequences
            if (!immediateConsequences) { return {} }
            immediateConsequences.splice(consequenceIndex, 1, isImmediateConsequence.data)
            return { stages }
        })
    }

    changeConsequenceList(newList: ImmediateConsequence[], stageIndex: number) {
        this.setState(state => {
            const { stages } = state
            const stage = stages[stageIndex]
            if (!stage) { return {} }
            stage.immediateConsequences = newList
            return { stages }
        })
    }

    renderStage(stage: Stage, stageIndex: number) {
        const { gameDesign } = this.props
        const { immediateConsequences = [] } = stage
        return (
            <section key={stageIndex}>
                <hr />
                <h3>stage {stageIndex + 1}</h3>
                {Object.entries(stage.characterOrders || {}).map(([characterId, orders]) => (
                    <div key={characterId}>
                        <h4>{characterId}, {orders.length} orders</h4>
                        {orders.map((order, orderIndex) => (
                            <OrderForm key={orderIndex}
                                data={order}
                                updateData={(newOrder) => { this.changeOrder(newOrder, stageIndex, characterId, orderIndex) }}
                            />
                        ))}
                    </div>
                ))}
                <h4>immediateConsequences: {stage.immediateConsequences?.length}</h4>

                <ListEditor list={immediateConsequences}
                    mutateList={(newList) => { this.changeConsequenceList(newList, stageIndex) }}
                    describeItem={(consequence, consequenceIndex) => (
                        <ConsequenceForm immediateOnly={true}
                            key={consequenceIndex}
                            consequence={consequence as AnyConsequence}
                            gameDesign={gameDesign}
                            update={(consequence) => { this.changeConsequence(consequence, stageIndex, consequenceIndex) }}
                        />
                    )}
                    createButton="END"
                    noMoveButtons
                    createItem={()=>makeNewConsequence('changeStatus')}
                />
            </section>
        )
    }

    render() {
        const { gameDesign, sequenceId, updateData } = this.props
        const { description, stages = [], id } = this.state

        return (
            <article>
                <h2>Sequences {id}</h2>

                <div className={styles.rowTopLeft}>
                    <fieldset className={styles.fieldset}>
                        <legend>details</legend>
                        <StringInput label="id" value={id}
                            inputHandler={(id) => { this.setState({ id }) }}
                        />
                        <StringInput label="description" value={description || ''}
                            inputHandler={(description) => { this.setState({ description }) }}
                        />
                    </fieldset>

                    <StorageMenu
                        type='sequence'
                        data={this.currentData}
                        originalId={sequenceId}
                        existingIds={Object.keys(gameDesign.sequences)}
                        reset={() => this.setState(this.initialState)}
                        update={() => { updateData(this.currentData) }}
                    />
                </div>

                <ListEditor
                    list={stages}
                    describeItem={this.renderStage}
                    mutateList={stages => { this.setState({ stages }) }}
                    createItem={makeBlankStage}
                />

            </article>
        )
    }
}