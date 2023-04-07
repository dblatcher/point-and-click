import { Card, Button, Box } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import { ConversationMenuProps } from "../game/uiComponentSet";


export function ConversationMenu({ conversation, select, }: ConversationMenuProps) {

    const branch = conversation.branches[conversation.currentBranch || conversation.defaultBranch]

    return (
        <Box marginY={1} component={Card}>
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