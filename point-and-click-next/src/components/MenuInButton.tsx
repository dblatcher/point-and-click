import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface Props {
    buttonText: string
    buttonId: string
    children: React.ReactNode
}

export default function MenuInButton({ children, buttonId, buttonText }: Props) {

    const menuId = `${buttonId}-menu`

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id={buttonId}
                aria-controls={open ? menuId : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                {buttonText}
            </Button>
            <Menu
                id={menuId}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': buttonId,
                }}
            >
                    {children}
                <MenuItem onClick={handleClose}>CLOSE</MenuItem>
            </Menu>
        </div>
    );
}