import type { Props } from "@/components/GameEditor"
import { Container, Divider, Skeleton, Stack } from '@mui/material'
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic<Props>(() => import('@/components/GameEditor', {}), {
  loading: () => (<>

    <Container maxWidth='xl'>
      <Stack
        direction={'row'}
        spacing={1}
        component={'main'}
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Stack
          component={'nav'}
          spacing={1}
          width={150}
        >
          <Skeleton variant='text' width={'100%'} sx={{ fontSize: 50 }} />
          <Skeleton variant='rounded' width={'100%'} height={500} />
        </Stack>

        <Stack component={'section'} flex={1} spacing={1}>
          <Skeleton variant='text' width={'100%'} sx={{ fontSize: 50 }} />
          <Skeleton variant='rounded' width={'100%'} height={650} />
        </Stack>
      </Stack>
    </Container>
  </>
  ),
  ssr: false,
})

export default function EditorLoader(props: Props) {
  return <DynamicComponent {...props} />
}