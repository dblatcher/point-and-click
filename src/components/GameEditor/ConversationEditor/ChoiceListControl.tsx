import { Conversation } from "point-click-lib";
import { ChoiceRefSet } from "point-click-lib";
import { Box, Button, Stack, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { ChoiceSelector } from "./ChoiceSelector";

interface Props {
    property: 'enablesChoices' | 'disablesChoices';
    choices: ChoiceRefSet[];
    change: { (property: 'enablesChoices' | 'disablesChoices', indexOfSet: number, newRefSet: ChoiceRefSet,): void };
    remove: { (property: 'enablesChoices' | 'disablesChoices', index: number): void };
    add: { (property: 'enablesChoices' | 'disablesChoices'): void };
    conversations: Conversation[];
    currentConversationId: string;
    openBranchId: string;
}

export const ChoiceListControl: FunctionComponent<Props> = ({
    property,
    choices, change, remove, add, conversations, currentConversationId, openBranchId,
}: Props) => {

    const whatItDoes = property === 'disablesChoices' ? 'disable' : 'enable'

    return (
        <Stack spacing={1}>
            <Typography variant="caption">
                This choice {whatItDoes}s the following choices:
            </Typography>

            {choices?.map((refSet, index) => (
                <ChoiceSelector refSet={refSet} key={index}
                    conversations={conversations}
                    currentConversationId={currentConversationId}
                    openBranchId={openBranchId || ''}
                    change={(newSet) => { change(property, index, newSet) }}
                    remove={() => { remove(property, index) }}
                />
            ))}

            <Box display='flex' justifyContent={"flex-end"}>
                <Button onClick={() => { add(property) }}>
                    add choice to {whatItDoes}
                </Button>
            </Box>
        </Stack>
    )
}