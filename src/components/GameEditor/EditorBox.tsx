import { Box, BoxProps, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface Props {
    title?: string;
    children: ReactNode;
    themePalette?: 'primary' | 'secondary';
    boxProps?: BoxProps;
    contentBoxProps?: BoxProps;
    barContent?: ReactNode;
    leftContent?: ReactNode;
}

export const EditorBox = ({ 
    title, 
    children, 
    themePalette = 'primary', 
    boxProps = {}, 
    barContent, 
    contentBoxProps, 
    leftContent,
}: Props) => {

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

            {(title || barContent || leftContent) && (
                <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    minHeight={30} // adding an icon button won't stretch further
                    sx={{
                        background: colorScheme.light,
                        paddingX: 2,
                    }}>
                    {leftContent}
                    <Typography component={'span'}>{title}</Typography>
                    <Box>
                        {barContent}
                    </Box>
                </Box>
            )}
            <Box component={'section'}
                sx={{
                    padding: 1,
                    ...contentBoxProps,
                }}>
                {children}
            </Box>
        </Box>
    )

}