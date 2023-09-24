import { defaultTheme } from "@/theme";
import { Alert, Button, ThemeProvider, Dialog, DialogActions, DialogTitle, IconButton } from "@mui/material";
import { MouseEventHandler, ReactNode, useState } from "react";

interface Props {
    label: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
    noConfirmation?: boolean;
    confirmationText?: string;
    useIconButton?: boolean;
    icon?: ReactNode;
}

export const ButtonWithConfirm = ({ label, onClick, noConfirmation, confirmationText, useIconButton, icon }: Props) => {
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
    const handleFirstButton = noConfirmation
        ? onClick
        : (): void => { setShowConfirmation(true) }
    const warningText = confirmationText || `Are you sure you want to ${label}?`

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
                >
                    {label}
                </Button>
            )}

            <ThemeProvider theme={defaultTheme}>
                <Dialog open={showConfirmation} onClose={(): void => { setShowConfirmation(false); }}>
                    <DialogTitle>
                        <Alert severity="warning">
                            {warningText}
                        </Alert>
                    </DialogTitle>
                    <DialogActions>
                        <Button
                            onClick={(): void => { setShowConfirmation(false); }}
                        >
                            no
                        </Button>
                        <Button color='warning'
                            onClick={(event): void => {
                                setShowConfirmation(false);
                                onClick.bind(undefined as never)(event);
                            }}
                        >
                            yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </ThemeProvider>
        </>
    )
}
