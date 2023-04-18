import { Box, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react'

interface Props {
    title?: string;
    children: ReactNode;
    themePalette?: 'primary' | 'secondary'
}

export const EditorBox = ({ title, children, themePalette = 'primary' }: Props) => {

    const theme = useTheme()
    const colorScheme = theme.palette[themePalette]

    return (
        <Box component={'section'}
            sx={{
                borderColor: colorScheme.light,
                borderWidth: 1,
                borderStyle: 'solid',
            }}>
            {title && (
                <Typography component={'div'}
                    variant='overline'
                    sx={{
                        background: colorScheme.light,
                        color: colorScheme.contrastText,
                        paddingX: 1,
                    }}>{title}</Typography>
            )}
            <Box component={'section'}
                sx={{
                    padding: 1,
                }}>
                {children}
            </Box>
        </Box>
    )

}