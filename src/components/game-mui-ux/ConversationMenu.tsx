import { Conversation, ConversationChoice } from "@/definitions";
import { Box, Button } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useGameStateDerivations } from "../game/game-state-context";

export const ConversationMenu = (props: { select: { (choice: ConversationChoice): void } }) => {
    const { currentConversation } = useGameStateDerivations()
    return <>{currentConversation && (
        <ConversationMenuInner {...props} conversation={currentConversation} />
    )}</>
}



export function ConversationMenuInner({ conversation, select }: {
    conversation: Conversation;
    select: { (choice: ConversationChoice): void };
}) {
    const branch = conversation.branches[conversation.currentBranch || conversation.defaultBranch]
    return (
        <Box marginBottom={1}>
            <ButtonGroup orientation="vertical" fullWidth>
                {branch && branch.choices.filter(_ => !_.disabled).map((choice, index) => (
                    <Button
                        sx={{ textTransform: 'none', textAlign: 'left', justifyContent: 'flex-start' }}
                        size="small"
                        key={index}
                        onClick={() => { select(choice) }}
                    >
                        {choice.text}
                    </Button>
                ))}
            </ButtonGroup>
        </Box>
    )
}