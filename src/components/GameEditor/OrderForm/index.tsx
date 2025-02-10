import { findValueAsType } from "@/lib/util";
import { Order, orderTypes } from "@/definitions/Order";
import { getDefaultOrder } from "../defaults";
import { OrderWithoutStepsForm } from "./OrderWithoutStepsForm";
import { OrderWithStepsForm } from "./OrderWithStepsForm";
import { Box } from "@mui/material";
import { SelectInput } from "@/components/SchemaForm/inputs";
import { NarrativeEditor } from "../NarrativeEditor";
import { Narrative } from "@/definitions/BaseTypes";
import { ActOrderForm } from "./ActOrderForm";


interface Props {
    data: Order;
    animationSuggestions: string[];
    targetIdOptions: string[];
    targetIdDescriptions: string[];
    updateData: { (data: Order): void };
}

export const OrderForm = ({ data, animationSuggestions, targetIdOptions, targetIdDescriptions, updateData }: Props) => {

    const changeType = (value: string | undefined) => {
        if (!value) { return }
        const orderType = findValueAsType(value, orderTypes)
        if (orderType) {
            updateData(getDefaultOrder(orderType))
        }
    }

    const updateNarrative = (newNarrative: Narrative | undefined) => {
        updateData({ ...data, narrative: newNarrative })
    }

    const buildForm = () => {

        switch (data.type) {
            case "move":
                return <OrderWithStepsForm
                    data={data}
                    animationSuggestions={animationSuggestions}
                    updateData={updateData}
                />
            case "act":
                return <ActOrderForm
                    data={data}
                    animationSuggestions={animationSuggestions}
                    updateData={updateData}
                />
            case "say":
            case "goTo":
                return <OrderWithoutStepsForm
                    data={data}
                    animationSuggestions={animationSuggestions}
                    targetIdOptions={targetIdOptions}
                    targetIdDescriptions={targetIdDescriptions}
                    updateData={updateData}
                />
        }
    }


    return (
        <Box component={'article'} sx={{ flex: 1, minWidth: 400, paddingY: 2 }}>
            <SelectInput label="order type"
                value={data.type}
                options={orderTypes}
                inputHandler={changeType}
            />
            {buildForm()}
            <NarrativeEditor narrative={data.narrative} update={updateNarrative} />
        </Box>
    )
}


