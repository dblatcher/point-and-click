import { Card, Button } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import { ConversationMenuProps } from "../game/uiComponentSet";
import { UiContainer } from "./UiContainer";


export function ConversationMenu({ conversation, select, }: ConversationMenuProps) {

    const branch = conversation.branches[conversation.currentBranch || conversation.defaultBranch]

    return (
        <UiContainer>
            <Card sx={{ padding: 1 }} component='nav'>
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
            </Card>
        </UiContainer>
    )
}