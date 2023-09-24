import { Box, BoxProps, IconButton, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react'

interface Props {
    title?: string;
    children: ReactNode;
    themePalette?: 'primary' | 'secondary';
    boxProps?: BoxProps;
    barContent?: ReactNode;
}

export const EditorBox = ({ title, children, themePalette = 'primary', boxProps = {}, barContent }: Props) => {

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
            {(title || barContent) && (
                <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    sx={{
                        background: colorScheme.light,
                        color: colorScheme.contrastText,
                        paddingX: 1,
                    }}>
                    <Typography component={'span'}
                        variant='overline'
                    >{title}</Typography>
                    <Box>
                        {barContent}
                    </Box>
                </Box>
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