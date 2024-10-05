import { StringInput } from "@/components/SchemaForm/inputs";
import { defaultTheme } from "@/theme";
import { Box, Button, ButtonProps, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, ThemeProvider } from "@mui/material";
import { ReactNode, useState } from "react";
import { AddIcon } from "@/components/GameEditor/material-icons"
import { useKeyBoard } from "@/hooks/use-keyboard";

interface Props {
    label: string;
    onEntry: { (input: string): void };
    dialogTitle: string;
    useIconButton?: boolean;
    icon?: ReactNode;
    buttonProps?: ButtonProps;
    suggestions?: string[];
    modifyInput?: { (input: string): string }
    keyboardShortcut?: string
    getError?: { (input: string): string | undefined }
    children?: ReactNode
}

export const ButtonWithTextInput = ({
    onEntry,
    label,
    dialogTitle,
    useIconButton,
    icon = <AddIcon color="primary" />,
    buttonProps = {},
    suggestions,
    modifyInput,
    keyboardShortcut,
    getError,
    children,
}: Props) => {
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [input, setInput] = useState<string>('')
    const handleFirstButton = (): void => { setShowDialog(true) }
    const handleInput = modifyInput ? (input: string) => setInput(modifyInput(input)) : setInput
    const errorMessage = getError?.(input);

    useKeyBoard(keyboardShortcut ? [{
        key: keyboardShortcut,
        handler: handleFirstButton,
    }] : [])


    return (
        <>
            {useIconButton ? (
                <IconButton
                    onClick={handleFirstButton}
                    aria-label={label}
                    size="small"
                >
                    {icon}
                </IconButton>
            ) : (
                <Button
                    onClick={handleFirstButton}
                    {...buttonProps}
                >
                    {label}
                </Button>
            )}

            <ThemeProvider theme={defaultTheme}>
                <Dialog open={showDialog} onClose={(): void => { setShowDialog(false); }}>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogContent>
                        {children}
                        <Box minHeight={55} minWidth={250}>
                            <StringInput
                                value={input}
                                inputHandler={handleInput}
                                error={errorMessage}
                                suggestions={suggestions} />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowDialog(false)}>cancel</Button>
                        <Button
                            disabled={!input || !!errorMessage}
                            onClick={() => {
                                setShowDialog(false);
                                setInput('')
                                onEntry(input)
                            }}
                        >
                            confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </ThemeProvider>
        </>
    )
}
