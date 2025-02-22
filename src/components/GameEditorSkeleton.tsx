import { editorTheme } from "@/theme";
import { Container, Stack, Skeleton, Box, ThemeProvider } from "@mui/material";
import React, { ReactNode, Fragment } from "react";

const Repeat = ({ children, count }: { children: ReactNode, count: number }) => {

    const iteroo: number[] = []
    iteroo.length = count
    iteroo.fill(0)

    return <>
        {iteroo.map((_n, i) => (
            <Fragment key={i}>
                {children}
            </Fragment>
        ))}
    </>

}

export const GameEditorSkeleton: React.FunctionComponent = () => (
    <ThemeProvider theme={editorTheme}>
        <Container maxWidth='xl'
            sx={{
                display: 'flex',
                flexDirection: 'row',
                overflow: 'hidden',
                flex: 1,
                gap: 5,
            }}
        >
            <Stack
                direction={'row'}
                spacing={1}
                component={'main'}
            >
                <Stack component={'nav'}
                    spacing={1}
                    width={150}
                >
                    <Stack direction={'row'} spacing={1} marginTop={1}>
                        <Repeat count={4}>
                            <Skeleton variant='circular' width={30} height={30} />
                        </Repeat>
                    </Stack>
                    <Repeat count={13}>
                        <Skeleton variant='rectangular' width={'100%'} height={22} />
                    </Repeat>
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
                        <Skeleton variant='circular' width={100} height={100} />
                    </div>
                </Stack>

                <Box component={'section'}
                    flex={1}
                    padding={1}
                >
                    <Box gap={2} display={'flex'} flexDirection={'column'} marginBottom={2}>
                        <Skeleton variant="text" width={120} height={30} />
                        <Skeleton variant="rectangular" width={'100%'} height={130} />
                    </Box>
                    <Box
                        display={'flex'}
                        gap={2}
                    >
                        <Skeleton variant="rectangular" width={160} height={160} />
                        <Skeleton variant="rectangular" width={160} height={400} />
                        <Skeleton variant="rectangular" width={160} height={250} />
                    </Box>
                </Box>
            </Stack>
        </Container>
    </ThemeProvider>
)