import React from 'react';
import { useGameDesign } from '@/context/game-design-context';
import { tabIcons, tabOrder } from '@/lib/editor-config';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

export const TabButtonList: React.FunctionComponent = () => {
    const { openInEditor, tabOpen } = useGameDesign()
    return (
        <List >
            {tabOrder.map((tab, index) => {
                const { label, id } = tab
                const displayTitle = label ?? id;
                const Icon = tabIcons[id];
                return (
                    <ListItem key={index} disablePadding>
                        <ListItemButton
                            sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, paddingY: 2 }}
                            onClick={() => { openInEditor(tab.id, undefined) }}
                            selected={tab.id === tabOpen}
                        >
                            {Icon && <ListItemIcon><Icon /></ListItemIcon>}
                            <ListItemText>
                                <Typography textTransform={label ? undefined : 'capitalize'}>{displayTitle}</Typography>
                            </ListItemText>
                            <ListItemText sx={{ textAlign: 'right' }}>{index + 1}</ListItemText>
                        </ListItemButton>
                    </ListItem>
                )
            })}
        </List>
    )
}