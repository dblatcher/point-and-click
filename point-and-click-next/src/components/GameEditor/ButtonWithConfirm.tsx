import { Alert, Button, ButtonGroup } from "@mui/material";
import { MouseEventHandler, useState } from "react";


interface Props {
    label: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
    noConfirmation?: boolean;
    confirmationText?: string;
}

export const ButtonWithConfirm = ({ label, onClick, noConfirmation, confirmationText }: Props) => {

    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)

    const handleFirstButton = noConfirmation
        ? onClick
        : (): void => { setShowConfirmation(true) }

    const warningText = confirmationText || `Are you sure you want to ${label}?`

    if (!showConfirmation) {
        return (
            <Button
                color="warning"
                onClick={handleFirstButton}
            >
                {label}
            </Button>
        )
    }

    return <ButtonGroup>
        <Alert severity="warning">
            {warningText}
        </Alert>

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
    </ButtonGroup>
}
