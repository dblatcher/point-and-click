import { StringInput } from "@/components/SchemaForm/inputs";
import { defaultTheme } from "@/theme";
import { Button, ButtonProps, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, ThemeProvider } from "@mui/material";
import { ReactNode, useState } from "react";
import AddIcon from "@mui/icons-material/Add"
import { useKeyBoard } from "@/hooks/use-keyboard";

interface Props {
    label: string;
    onEntry: { (input: string): void };
    confirmationText: string;
    useIconButton?: boolean;
    icon?: ReactNode;
    buttonProps?: ButtonProps;
    suggestions?: string[];
    modifyInput?: { (input: string): string }
    keyboardShortcut?: string
}

export const ButtonWithTextInput = ({
    onEntry,
    label,
    confirmationText,
    useIconButton,
    icon = <AddIcon color="primary" />,
    buttonProps = {},
    suggestions,
    modifyInput,
    keyboardShortcut,
}: Props) => {
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
    const [input, setInput] = useState<string>('')
    const handleFirstButton = (): void => { setShowConfirmation(true) }
    const handleInput = modifyInput ? (input: string) => setInput(modifyInput(input)) : setInput

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
                <Dialog open={showConfirmation} onClose={(): void => { setShowConfirmation(false); }}>
                    <DialogTitle>
                        {confirmationText}
                    </DialogTitle>
                    <DialogContent>
                        <StringInput
                            value={input}
                            inputHandler={handleInput}
                            suggestions={suggestions} />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={(): void => { setShowConfirmation(false); }}
                        >
                            cancel
                        </Button>
                        <Button
                            onClick={() => {
                                setShowConfirmation(false);
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
