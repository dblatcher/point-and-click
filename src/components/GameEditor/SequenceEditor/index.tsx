/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import { AnyConsequence, Consequence, GameDesign, Order, Sequence } from "src";
import { cloneData } from "../../../lib/clone";
import { makeBlankSequence } from "../defaults";
import { ConsequenceForm } from "../InteractionEditor/ConsequenceForm";
import { OrderForm } from "../OrderForm";
import { StorageMenu } from "../StorageMenu";

interface Props {
    gameDesign: GameDesign;
    sequenceId?: string;
    data?: Sequence;
    updateData?: { (data: Sequence): void };
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
    }

    get initialState(): Sequence {
        const { data } = this.props
        return data ? {
            ...data
        } : makeBlankSequence()
    }

    get currentData(): Sequence {
        const characterData = cloneData(this.state) as State;
        return characterData
    }

    changeOrder(newOrder: Order, stageIndex: number, characterId: string, orderIndex: number) {
        throw new Error("Method not implemented.");
    }

    changeConsequence(consequence: Consequence, stageIndex: number, consequenceIndex: number) {
        throw new Error("Method not implemented.");
    }


    render() {
        const { gameDesign, sequenceId } = this.props
        const { description, stages } = this.state

        return (
            <article>
                <h2>Sequence {sequenceId}</h2>
                <p>description: {description}</p>

                <StorageMenu
                    type='sequence'
                    data={sequenceId ? { id: sequenceId } : undefined}
                    originalId={sequenceId}
                    existingIds={Object.keys(gameDesign.sequences)}
                    reset={() => this.setState(this.initialState)}
                    update={() => { }}
                />
                <p>stages: {stages.length}</p>

                {stages.map((stage, stageIndex) => (
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
                        {stage.immediateConsequences?.map((consequence, consequenceIndex) => (
                            <ConsequenceForm
                                key={consequenceIndex}
                                consequence={consequence as AnyConsequence}
                                gameDesign={gameDesign}
                                update={(consequence) => { this.changeConsequence(consequence, stageIndex, consequenceIndex) }}
                            />
                        ))}
                    </section>
                ))}
            </article >
        )
    }
}