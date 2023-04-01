import { Conversation, ConversationChoice } from "@/oldsrc"
import { Container, Card, Button } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";


interface Props {
    conversation: Conversation;
    select: { (choice: ConversationChoice): void };
}

export function ConversationMenu({ conversation, select, }: Props) {

    const branch = conversation.branches[conversation.currentBranch || conversation.defaultBranch]

    return (
        <Container maxWidth={'sm'} sx={{ padding: 1 }}>
            <Card sx={{ padding: 1 }} component='nav'>
                <ButtonGroup orientation="vertical" fullWidth>
                    {branch && branch.choices.filter(_ => !_.disabled).map((choice, index) => (
                        <Button
                            sx={{ textTransform: 'none', textAlign:'left', justifyContent:'flex-start' }}
                            size="small"
                            key={index}
                            onClick={() => { select(choice) }}
                        >
                            {choice.text}
                        </Button>
                    ))}
                </ButtonGroup>
            </Card>
        </Container>
    )
}