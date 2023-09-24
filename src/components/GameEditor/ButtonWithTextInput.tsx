import { StringInput } from "@/components/SchemaForm/inputs";
import { defaultTheme } from "@/theme";
import { Button, ButtonProps, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, ThemeProvider } from "@mui/material";
import { ReactNode, useState } from "react";

interface Props {
    label: string;
    onEntry: { (input: string): void };
    confirmationText: string;
    useIconButton?: boolean;
    icon?: ReactNode;
    buttonProps?: ButtonProps;
}

export const ButtonWithTextInput = ({ onEntry, label, confirmationText, useIconButton, icon, buttonProps = {} }: Props) => {
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
    const [input, setInput] = useState<string>('')
    const handleFirstButton = (): void => { setShowConfirmation(true) }

    return (
        <>
            {useIconButton && !!icon ? (
                <IconButton
                    onClick={handleFirstButton}
                    aria-label={label}
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
                        <StringInput value={input} inputHandler={setInput} />
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
