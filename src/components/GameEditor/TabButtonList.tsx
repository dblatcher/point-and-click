import React from 'react';
import { useGameDesign } from '@/context/game-design-context';
import { tabIcons, tabOrder, countItemsFunction } from '@/lib/editor-config';
import { Badge, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useAssets } from '@/context/asset-context';

export const TabButtonList: React.FunctionComponent = () => {
    const { openInEditor, tabOpen, gameDesign } = useGameDesign()
    const { soundAssets, imageAssets } = useAssets()
    const countItems = countItemsFunction(gameDesign, soundAssets, imageAssets);

    return (
        <List disablePadding dense>
            {tabOrder.map((tab, index) => {
                const { label, id } = tab
                const displayTitle = label ?? id;
                const Icon = tabIcons[id];
                const count = countItems(tab);
                const countText = typeof count === 'number' ? `x${count} ${displayTitle}` : undefined
                return (
                    <ListItem key={index} disablePadding title={countText}>
                        <ListItemButton
                            sx={{ paddingY: 0 }}
                            onClick={() => { openInEditor(tab.id, undefined) }}
                            selected={tab.id === tabOpen}
                        >
                            {Icon && <ListItemIcon ><Icon fontSize={'small'} /></ListItemIcon>}
                            <ListItemText disableTypography>
                                <Typography fontSize={'small'} textTransform={label ? undefined : 'capitalize'}>{displayTitle}</Typography>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                )
            })}
        </List>
    )
}