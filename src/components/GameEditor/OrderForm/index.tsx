/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h, FunctionComponent } from "preact"
import { Order } from "../../../definitions/Order";
import { OrderWithStepsForm } from "./OrderWithStepsForm";


interface Props {
    data: Order;
    animationSuggestions?: string[]
    updateData: { (data: Order): void };
}

export const OrderForm: FunctionComponent<Props> = ({ data, animationSuggestions, updateData }) => {

    if ('steps' in data) {
        return <OrderWithStepsForm
            data={data}
            animationSuggestions={animationSuggestions}
            updateData={updateData} />
    }

    return <p>NEED TO SUPPORT SAY ORDER</p>
}


