/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h, Component } from "preact"
import styles from "../editorStyles.module.css"
import { Order, OrderType, orderTypes } from "../../../definitions/Order";
import { SelectInput } from "../formControls";
import { getDefaultOrder } from "../defaults";

interface Props {
    data: Order;
    updateData: { (data: Order): void };
}


export class OrderForm extends Component<Props> {


    changeValue(propery: keyof Order, newValue: string | undefined) {

        switch (propery) {
            case 'type': {
                if (orderTypes.includes(newValue as OrderType)) {
                    this.props.updateData(getDefaultOrder(newValue as OrderType))
                }
            }
        }

    }

    render() {
        const { type, steps } = this.props.data

        return (
            <article>
                <div class={styles.container}>
                    <SelectInput label="Type"
                        value={type}
                        items={orderTypes}
                        onSelect={newValue => this.changeValue('type', newValue)}
                    />
                </div>
                <div class={styles.container}>
                    <p>steps: {steps.length}</p>
                </div>
            </article>
        )
    }
}