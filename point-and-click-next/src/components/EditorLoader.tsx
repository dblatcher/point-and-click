import { Grid, Skeleton } from '@mui/material'
import dynamic from 'next/dynamic'


const DynamicComponent = dynamic(() => import('@/components/GameEditor'), {
  loading: () => (<>
    <Grid container spacing={2} padding={2}>
      <Grid item xs={3}>
        <Skeleton variant='text' width={'100%'} sx={{ fontSize: '2rem' }} />
        <Skeleton variant='text' width={'100%'} sx={{ fontSize: '1rem' }} />
        <Skeleton variant='text' width={'100%'} sx={{ fontSize: '1rem' }} />
        <Skeleton variant='rounded' width={'100%'} height={300} />
      </Grid>
      <Grid item xs={9}>
        <Skeleton variant='text' width={'100%'} sx={{ fontSize: '2rem' }} />
        <Skeleton variant='rounded' width={'100%'} height={200} />
      </Grid>
    </Grid>
  </>
  ),
  ssr: false,
})

export default function EditorLoader() {
  return <DynamicComponent />
}