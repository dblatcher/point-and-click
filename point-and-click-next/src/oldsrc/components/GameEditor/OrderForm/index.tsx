import { FunctionComponent } from "react"
import { findValueAsType } from "@/lib/util";
import { Order, orderTypes } from "../../../definitions/Order";
import { getDefaultOrder } from "../defaults";
import { OrderWithoutStepsForm } from "./OrderWithoutStepsForm";
import { OrderWithStepsForm } from "./OrderWithStepsForm";


interface Props {
    data: Order;
    animationSuggestions: string[];
    targetIdOptions: string[];
    targetIdDescriptions: string[];
    updateData: { (data: Order): void };
}

export const OrderForm: FunctionComponent<Props> = ({ data, animationSuggestions, targetIdOptions, targetIdDescriptions, updateData }) => {

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
        targetIdOptions={targetIdOptions}
        targetIdDescriptions={targetIdDescriptions}
        updateData={updateData}
        changeType={changeType}
    />
}


