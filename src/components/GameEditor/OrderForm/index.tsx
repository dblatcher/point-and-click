import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { StringInput } from "@/components/SchemaForm/StringInput";
import { Direction, directions } from "point-click-lib";
import { Order } from "point-click-lib";
import { Box, Stack } from "@mui/material";
import { ReactNode } from "react";
import { ActOrderForm } from "./ActOrderForm";
import { GoToOrderForm } from "./GoToOrderForm";
import { MoveOrderForm } from "./MoveOrderForm";
import { SayOrderForm } from "./SayOrderForm";


interface Props {
    actorId?: string;
    data: Order;
    animationSuggestions: string[];
    targetIdOptions: string[];
    targetIdDescriptions: ReactNode[];
    updateData: { (data: Order): void };
}

export const OrderForm = ({ data, animationSuggestions, targetIdOptions, targetIdDescriptions, updateData, actorId }: Props) => {

    return (
        <Box component={'article'} sx={{ flex: 1, minWidth: 400, paddingY: 2 }}>
            {data.type === 'act' && (
                <ActOrderForm
                    data={data}
                    animationSuggestions={animationSuggestions}
                    updateData={updateData} />
            )}
            {data.type === 'goTo' && (
                <GoToOrderForm
                    actorId={actorId}
                    data={data}
                    animationSuggestions={animationSuggestions}
                    targetIdOptions={targetIdOptions}
                    targetIdDescriptions={targetIdDescriptions}
                    updateData={updateData} />
            )}
            {data.type === 'move' && (
                <MoveOrderForm
                    data={data}
                    animationSuggestions={animationSuggestions}
                    updateData={updateData} />
            )}
            {data.type === 'say' && (
                <SayOrderForm
                    actorId={actorId}
                    data={data}
                    animationSuggestions={animationSuggestions}
                    updateData={updateData} />
            )}

            <Stack gap={2}>
                {(data.type !== 'move' && data.type !== 'goTo') && (
                    <SelectInput label="start direction"
                        notFullWidth
                        minWidth={150}
                        maxWidth={150}
                        options={directions}
                        optional
                        value={data.startDirection}
                        inputHandler={startDirection => updateData({ ...data, startDirection: startDirection as Direction })}
                    />
                )}
                <SelectInput label="end direction"
                    notFullWidth
                    minWidth={150}
                    maxWidth={150}
                    options={directions}
                    optional
                    value={data.endDirection}
                    inputHandler={endDirection => updateData({ ...data, endDirection: endDirection as Direction })}
                />
                <StringInput label="status when done"
                    notFullWidth
                    minWidth={150}
                    maxWidth={150}
                    optional
                    suggestions={animationSuggestions}
                    value={data.endStatus ?? ''}
                    inputHandler={endStatus => updateData({ ...data, endStatus })}
                />
            </Stack>
        </Box>
    )
}


