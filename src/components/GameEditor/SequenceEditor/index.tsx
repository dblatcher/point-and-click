/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import { AnyConsequence, Consequence, GameDesign, Order, Sequence, Stage, ImmediateConsequence } from "src";
import { ImmediateConsequenceSchema } from "../../../definitions/Consequence";
import { cloneData } from "../../../lib/clone";
import { getDefaultOrder, makeBlankSequence, makeBlankStage, makeNewConsequence } from "../defaults";
import { ConsequenceForm } from "../InteractionEditor/ConsequenceForm";
import { ListEditor } from "../ListEditor";
import { OrderForm } from "../OrderForm";
import { StorageMenu } from "../StorageMenu";
import styles from "../editorStyles.module.css"
import { SelectAndConfirmInput, StringInput } from "../formControls";
import { TabMenu } from "../../TabMenu";
import { listIds, findById } from "../../../lib/util";
import { DataItemEditorProps } from "../dataEditors";

type Props = DataItemEditorProps<Sequence> & {
    gameDesign: GameDesign;
    sequenceId?: string;
}

type ExtraState = {

}
type State = Sequence & ExtraState



export class SequenceEditor extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = this.initialState
        this.changeOrder = this.changeOrder.bind(this)
        this.changeOrderList = this.changeOrderList.bind(this)
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
        const actorData = cloneData(this.state) as State;
        return actorData
    }

    changeOrder(order: Order, stageIndex: number, actorId: string, orderIndex: number) {
        this.setState(state => {
            const { stages } = state
            const actorOrders = stages[stageIndex]?.actorOrders
            if (!actorOrders) { return {} }
            const ordersForActor = actorOrders[actorId]
            if (!ordersForActor) { return {} }
            ordersForActor.splice(orderIndex, 1, order)
            return { stages }
        })
    }

    changeOrderList(newList: Order[], stageIndex: number, actorId: string) {
        this.setState(state => {
            const { stages } = state
            const stage = stages[stageIndex]
            if (!stage) { return {} }
            if (!stage.actorOrders) { stage.actorOrders = {} }
            stage.actorOrders[actorId] = newList
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

    renderActorOrderList(actorId: string, orders: Order[], stageIndex: number) {
        const { gameDesign } = this.props
        const actorData = findById(actorId, gameDesign.actors)
        const spriteData = findById(actorData?.sprite, gameDesign.sprites)
        return (
            <ListEditor
                list={orders}
                describeItem={(order, orderIndex) => (
                    <OrderForm key={orderIndex}
                        data={order}
                        spriteData={spriteData}
                        updateData={(newOrder) => { this.changeOrder(newOrder, stageIndex, actorId, orderIndex) }}
                    />
                )}
                mutateList={newList => { this.changeOrderList(newList, stageIndex, actorId) }}
                createItem={() => getDefaultOrder('act')}
            />
        )
    }

    renderStage(stage: Stage, stageIndex: number) {
        const { gameDesign } = this.props
        const { immediateConsequences = [], actorOrders = {} } = stage
        return (
            <section key={stageIndex} style={{ width: '100%' }}>
                <h3>stage {stageIndex + 1}</h3>
                <SelectAndConfirmInput
                    label="add orders for:"
                    items={listIds(gameDesign.actors).filter(id => !Object.keys(actorOrders).includes(id))}
                    onSelect={value => { this.changeOrderList([getDefaultOrder('talk')], stageIndex, value) }}
                />

                <TabMenu backgroundColor="none"
                    tabs={
                        [
                            ...Object.entries(actorOrders).map(([actorId, orders]) => ({
                                content: this.renderActorOrderList(actorId, orders, stageIndex),
                                label: `${actorId}[${orders.length}]`
                            })),
                            {
                                label: `consequences [${immediateConsequences.length}]`,
                                content: <ListEditor list={immediateConsequences}
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
                                    createItem={() => makeNewConsequence('changeStatus')}
                                />
                            }
                        ]
                    }
                />
            </section>
        )
    }

    render() {
        const { gameDesign, sequenceId, updateData } = this.props
        const { description, stages = [], id } = this.state

        return (
            <article>
                <h2>Sequence Editor</h2>

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
                        deleteItem={this.props.deleteData}
                    />
                </div>

                <ListEditor
                    list={stages}
                    describeItem={this.renderStage}
                    mutateList={stages => { this.setState({ stages }) }}
                    createItem={makeBlankStage}
                    heavyBorders={true}
                />
            </article>
        )
    }
}