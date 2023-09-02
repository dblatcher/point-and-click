import { FunctionComponent, useState } from "react";
import { StringInput } from "@/components/SchemaForm/inputs";
import { Sprite } from "@/lib/Sprite";
import { Box, Alert, Stack, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add"
import { EditorBox } from "../EditorBox";

interface Props {
    existingKeys: string[];
    submit: { (animationKey: string): void };
}

export const NewAnimationForm: FunctionComponent<Props> = ({ existingKeys, submit }: Props) => {
    const [animationKey, setAnimationKey] = useState<string>('')
    const keyAlreadyUsed = existingKeys.includes(animationKey)
    const warning = keyAlreadyUsed ? `There is already an animation called ${animationKey}` : undefined;
    const handleSubmit = () => {
        if (keyAlreadyUsed || animationKey === '') { return }
        submit(animationKey)
        setAnimationKey('')
    }

    const animationKeySuggestions = Object.values(Sprite.DEFAULT_ANIMATION)
        .filter(value => !existingKeys.includes(value))

    return (
        <EditorBox title="Add Animation">
            <Stack direction={'row'} alignItems={'center'}>
                <Box flexBasis={200}>
                    <StringInput
                        label="animation name" value={animationKey}
                        inputHandler={setAnimationKey}
                        suggestions={animationKeySuggestions}
                    />
                </Box>

                <IconButton
                    onClick={handleSubmit}
                    disabled={keyAlreadyUsed || animationKey === ''}
                    color="primary"
                ><AddIcon /></IconButton>
                {warning && (
                    <Alert severity="warning">{warning}</Alert>
                )}
            </Stack>
        </EditorBox>
    )
}