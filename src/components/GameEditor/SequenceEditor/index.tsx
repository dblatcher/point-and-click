/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import { AnyConsequence, GameDesign, Sequence } from "src";
import { makeBlankSequence } from "../defaults";
import { ConsequenceForm } from "../InteractionEditor/ConsequenceForm";
import { OrderForm } from "../OrderForm";

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
        const initialState = props.data ? {
            ...props.data
        } : makeBlankSequence()

        this.state = {
            ...initialState
        }

    }


    render() {
        const { gameDesign, sequenceId } = this.props
        const { description, stages } = this.state


        return (
            <article>
                <h2>Sequence {sequenceId}</h2>
                <p>description: {description}</p>
                <p>stages: {stages.length}</p>

                {stages.map((stage, index) => (
                    <section key={index}>
                        <hr />
                        <h3>stage {index + 1}</h3>
                        {Object.entries(stage.characterOrders || {}).map(([characterId, orders]) => (
                            <div key={characterId}>
                                <h4>{characterId}, {orders.length} orders</h4>
                                {orders.map((order, index) => (
                                    <OrderForm key={index}
                                        data={order}
                                        updateData={() => { }}
                                    />
                                ))}
                            </div>
                        ))}
                        <h4>immediateConsequences: {stage.immediateConsequences?.length}</h4>
                        {stage.immediateConsequences?.map((consequence, index) => (
                            <ConsequenceForm
                                key={index}
                                consequence={consequence as AnyConsequence}
                                gameDesign={gameDesign}
                                edit={() => { }}
                            />
                        ))}
                    </section>
                ))}
            </article >
        )
    }
}