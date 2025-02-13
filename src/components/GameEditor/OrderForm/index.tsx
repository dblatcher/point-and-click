import { Narrative } from "@/definitions/BaseTypes";
import { Order, orderTypes } from "@/definitions/Order";
import { findValueAsType } from "@/lib/util";
import { Box, Button, ButtonGroup } from "@mui/material";
import { getDefaultOrder } from "../defaults";
import { NarrativeEditor } from "../NarrativeEditor";
import { getOrderIcon } from "../SequenceEditor/get-order-details";
import { ActOrderForm } from "./ActOrderForm";
import { MoveOrderForm } from "./MoveOrderForm";
import { OrderWithoutStepsForm } from "./OrderWithoutStepsForm";


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
                return <MoveOrderForm
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
            <ButtonGroup fullWidth sx={{ marginBottom: 1 }}>
                {orderTypes.map(type => {
                    const OrderIcon = getOrderIcon(type)
                    return <Button
                        key={type}
                        variant={type === data.type ? 'contained' : 'outlined'}
                        startIcon={<OrderIcon />}
                        onClick={() => changeType(type)}
                    >{type}</Button>
                }
                )}
            </ButtonGroup>
            {buildForm()}
            <NarrativeEditor narrative={data.narrative} update={updateNarrative} />
        </Box>
    )
}


