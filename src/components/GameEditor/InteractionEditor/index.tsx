/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import { Interaction } from "../../../definitions/Interaction";
import { ListEditor } from "../ListEditor";

interface Props {
    interactions: Interaction[];
}

interface State {
    interaction?: Interaction;
}

export class InteractionEditor extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {

        }
    }

    render() {
        const { interactions } = this.props
        return (
            <article>
                <h2>Interactions</h2>
                <p>{interactions.length} interactions</p>
                <ListEditor
                    list={interactions}
                    describeItem={interaction => `${interaction.verbId}-${interaction.itemId || ''}-${interaction.targetId}`}
                    deleteItem={() => { }}
                    insertItem={() => { }}
                />
            </article>
        )
    }
}