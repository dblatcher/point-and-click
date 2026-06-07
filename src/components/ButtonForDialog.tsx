import { Button, ButtonProps, Dialog } from "@mui/material";
import { ReactNode, useState } from "react";

type Props = {
    buttonContent: ReactNode;
    buttonProps?: Omit<ButtonProps, 'onClick'>;
    children: ((close: { (): void }) => ReactNode)
}

export const ButtonForDialog = ({ children, buttonContent, buttonProps }: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    return <>
        <Button onClick={() => setIsOpen(true)}  {...buttonProps}>{buttonContent}</Button>
        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
            {children(() => setIsOpen(false))}
        </Dialog>
    </>
}