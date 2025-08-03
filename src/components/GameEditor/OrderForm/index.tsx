import { Direction, directions, Narrative } from "@/definitions/BaseTypes";
import { Order } from "@/definitions/Order";
import { Box } from "@mui/material";
import { NarrativeEditor } from "../NarrativeEditor";
import { ActOrderForm } from "./ActOrderForm";
import { MoveOrderForm } from "./MoveOrderForm";
import { OrderWithoutStepsForm } from "./OrderWithoutStepsForm";
import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { ReactNode } from "react";


interface Props {
    data: Order;
    animationSuggestions: string[];
    targetIdOptions: string[];
    targetIdDescriptions: ReactNode[];
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

            <Box display={'flex'} gap={2}>
                {(data.type !== 'move' && data.type !== 'goTo') && (
                    <SelectInput label="start direction"
                        notFullWidth
                        minWidth={100}
                        options={directions}
                        optional
                        value={data.startDirection}
                        inputHandler={(startDirection) => { updateData({ ...data, startDirection: startDirection as Direction }) }}
                    />
                )}
                <SelectInput label="end direction"
                    notFullWidth
                    minWidth={100}
                    options={directions}
                    optional
                    value={data.endDirection}
                    inputHandler={(endDirection) => { updateData({ ...data, endDirection: endDirection as Direction }) }}
                />
                <NarrativeEditor narrative={data.narrative} update={updateNarrative} />
            </Box>
        </Box>
    )
}


