import { Narrative } from "@/definitions/BaseTypes";
import { Order } from "@/definitions/Order";
import { Box } from "@mui/material";
import { NarrativeEditor } from "../NarrativeEditor";
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
            {buildForm()}
            <NarrativeEditor narrative={data.narrative} update={updateNarrative} />
        </Box>
    )
}


