/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h, FunctionComponent } from "preact"
import { findValueAsType } from "../../../lib/util";
import { Order, orderTypes } from "../../../definitions/Order";
import { getDefaultOrder } from "../defaults";
import { OrderWithoutStepsForm } from "./OrderWithoutStepsForm";
import { OrderWithStepsForm } from "./OrderWithStepsForm";


interface Props {
    data: Order;
    animationSuggestions?: string[];
    updateData: { (data: Order): void };
}

export const OrderForm: FunctionComponent<Props> = ({ data, animationSuggestions, updateData }) => {

    const changeType = (value: string) => {
        const orderType = findValueAsType(value, orderTypes)
        if (orderType) {
            updateData(getDefaultOrder(orderType))
        }
    }

    if ('steps' in data) {
        return <OrderWithStepsForm
            data={data}
            animationSuggestions={animationSuggestions}
            updateData={updateData}
            changeType={changeType}
        />
    }

    return <OrderWithoutStepsForm
        data={data}
        animationSuggestions={animationSuggestions}
        updateData={updateData}
        changeType={changeType}
    />
}


