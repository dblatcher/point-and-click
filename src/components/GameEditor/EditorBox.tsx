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

const shouldUseDefaultPadding = (contentBoxProps?: BoxProps) => {
    if (!contentBoxProps) {
        return true
    }
    const { sx, padding, paddingBottom, paddingTop, paddingX, paddingY } = contentBoxProps;

    return !sx && [padding, paddingBottom, paddingTop, paddingX, paddingY].every(prop => typeof (prop) === 'undefined')
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

    const useDefaultContentPadding = shouldUseDefaultPadding(contentBoxProps)

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
                sx={useDefaultContentPadding ? {
                    padding: 1,
                } : undefined}
                {...contentBoxProps}
            >
                {children}
            </Box>
        </Box>
    )

}