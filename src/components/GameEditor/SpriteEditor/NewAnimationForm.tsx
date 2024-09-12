import { FunctionComponent, useState } from "react";
import { StringInput } from "@/components/SchemaForm/inputs";
import { Sprite } from "@/lib/Sprite";
import { Box, Alert, Stack, IconButton } from "@mui/material";
import { AddIcon } from "@/components/GameEditor/material-icons"
import { EditorBox } from "../EditorBox";

interface Props {
    existingKeys: string[];
    submit: { (animationKey: string): void };
}

export const NewAnimationForm: FunctionComponent<Props> = ({ existingKeys, submit }: Props) => {
    const [animationKey, setAnimationKey] = useState<string>('')
    const keyAlreadyUsed = existingKeys.includes(animationKey)
    const warning = keyAlreadyUsed ? `animation "${animationKey}" already exists` : undefined;
    const handleSubmit = () => {
        if (keyAlreadyUsed || animationKey === '') { return }
        submit(animationKey)
        setAnimationKey('')
    }

    const animationKeySuggestions = Array.from(new Set(Object.values(Sprite.DEFAULT_ANIMATION)
        .filter(value => !existingKeys.includes(value))))

    return (
        <EditorBox title="Add Animation" boxProps={{ minWidth: 220 }}>
            <Stack minHeight={160}>
                <Stack direction={'row'} alignItems={'center'}>
                    <Box flexBasis={180}>
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
                </Stack>
                {warning && (
                    <Box width={200}>
                        <Alert severity="warning">{warning}</Alert>
                    </Box>
                )}
            </Stack>
        </EditorBox>
    )
}