import type { GameEditorProps } from "@/components/GameEditor"
import { editorTheme } from "@/theme"
import { Box, Container, Skeleton, Stack, ThemeProvider } from '@mui/material'
import dynamic from 'next/dynamic'
import { Fragment, ReactNode } from "react"

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

const DynamicComponent = dynamic<GameEditorProps>(() => import('@/components/GameEditor', {}), {
  loading: () => (<>
    <ThemeProvider theme={editorTheme}>
      <Container maxWidth='xl'>
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
          </Stack>

          <Box component={'section'}
            flex={1}
            padding={1}
          >
            <Skeleton variant="text" width={120} height={30} />
            <Box
              display={'flex'}
              gap={2}
            >
              <Skeleton variant="rectangular" width={160} height={200} />
              <Skeleton variant="rectangular" width={160} height={400} />
              <Skeleton variant="rectangular" width={160} height={250} />
            </Box>
          </Box>
        </Stack>
      </Container>
    </ThemeProvider>
  </>
  ),
  ssr: false,
})

export default function EditorLoader(props: GameEditorProps) {
  return <DynamicComponent {...props} />
}