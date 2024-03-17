import { useGameDesign } from "@/context/game-design-context";
import { Conversation } from "@/definitions";
import { ConversationSchema } from "@/definitions/Conversation";
import { uploadJsonData } from "@/lib/files";
import { Alert, Box, Button, ButtonGroup, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { ButtonWithTextInput } from "./ButtonWithTextInput";
import { EditorHeading } from "./EditorHeading";
import { makeBlankConversation } from "./defaults";
import { cloneData } from "@/lib/clone";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import UploadIcon from "@mui/icons-material/Upload"
import AddIcon from "@mui/icons-material/Add";

interface Props {
    openInEditor: { (id: string): void }
}

export const ConversationCreator: React.FunctionComponent<Props> = ({ openInEditor }) => {
    const { gameDesign, performUpdate } = useGameDesign()
    const [warning, setWarning] = useState<string | undefined>()

    const handleStartFromScratch = (proposedId: string) => {
        attemptCreate({ ...makeBlankConversation(), id: proposedId })
    }

    function handleDuplicate(proposedId: string, item: Conversation): void {
        attemptCreate({ ...cloneData(item), id: proposedId })
    }

    const handleLoadButton = async () => {
        const { data, error } = await uploadJsonData(ConversationSchema)
        if (error) {
            return setWarning(`upload failed: ${error}`)
        }
        if (!data) {
            return setWarning('File did not contain valid conversation data')
        }
        attemptCreate(data)
    }

    const attemptCreate = (newConversation: Conversation) => {
        setWarning(undefined)
        if (!newConversation.id) {
            return setWarning('no id specified')
        }
        if (gameDesign.conversations.some(conversation => conversation.id == newConversation.id)) {
            return setWarning(`There is already a conversation called "${newConversation.id}"`)
        }
        performUpdate('conversations', newConversation)
        openInEditor(newConversation.id)
    }

    return (
        <Stack component={'article'} spacing={2} height={'100%'}>
            <EditorHeading heading={`Conversation Creator`} />

            <Typography variant="h3">Add new conversation</Typography>
            <ButtonGroup>
                <ButtonWithTextInput
                    label="Start from scratch"
                    onEntry={handleStartFromScratch}
                    buttonProps={{ startIcon: <AddIcon /> }}
                    confirmationText="Enter conversation name" />
                <Button
                    onClick={handleLoadButton}
                    startIcon={<UploadIcon />}
                >load from data file</Button>
            </ButtonGroup>

            <Typography variant="h3">Duplicate existing conversation</Typography>
            <Box>
                <ButtonGroup orientation="vertical">
                    {gameDesign.conversations.map(item => (
                        <ButtonWithTextInput key={item.id}
                            label={item.id}
                            buttonProps={{ startIcon: <ContentCopyIcon /> }}
                            onEntry={(newId) => handleDuplicate(newId, item)}
                            confirmationText="Enter conversation name"
                        />
                    ))}
                </ButtonGroup>
            </Box>

            {warning && (
                <Alert severity="warning">{warning}</Alert>
            )}
        </Stack>
    )

}