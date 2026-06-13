import { Button, ButtonProps, Dialog, DialogProps } from "@mui/material";
import { ReactNode, useState } from "react";

type Props = {
    buttonContent: ReactNode;
    buttonProps?: Omit<ButtonProps, 'onClick'>;
    children: ((close: { (): void }) => ReactNode)
    dialogProps?: Partial<DialogProps>
    onOpen?: { (): void }
}

export const ButtonForDialog = ({ children, buttonContent, buttonProps, dialogProps, onOpen }: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    return <>
        <Button onClick={() => {
            setIsOpen(true)
            onOpen?.()
        }}  {...buttonProps}>{buttonContent}</Button>
        <Dialog {...dialogProps} open={isOpen} onClose={() => setIsOpen(false)}>
            {children(() => setIsOpen(false))}
        </Dialog>
    </>
}