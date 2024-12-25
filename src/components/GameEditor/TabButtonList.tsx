import React from 'react';
import { useGameDesign } from '@/context/game-design-context';
import { tabOrder } from '@/lib/editor-config';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';

export const TabButtonList: React.FunctionComponent = () => {
    const { openInEditor, tabOpen } = useGameDesign()
    return (
        <List disablePadding>
            {tabOrder.map((tab, index) => (
                <ListItem key={index} disableGutters disablePadding>
                    <ListItemButton
                        onClick={() => { openInEditor(tab.id, undefined) }}
                        selected={tab.id === tabOpen}
                    >
                        <ListItemText>{index + 1}</ListItemText>
                        <ListItemText>{tab.label}</ListItemText>
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    )
}