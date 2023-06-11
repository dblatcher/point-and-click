import { Box, BoxProps, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react'

interface Props {
    title?: string;
    children: ReactNode;
    themePalette?: 'primary' | 'secondary';
    boxProps?: BoxProps;
}

export const EditorBox = ({ title, children, themePalette = 'primary', boxProps = {} }: Props) => {

    const theme = useTheme()
    const colorScheme = theme.palette[themePalette]

    return (
        <Box component={'section'}
            sx={{
                borderColor: colorScheme.light,
                borderWidth: 1,
                borderStyle: 'solid',
            }}
            {...boxProps}
        >
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