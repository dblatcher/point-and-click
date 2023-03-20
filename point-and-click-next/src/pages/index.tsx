import { Card, Grid } from '@mui/material'
import { LinkButton } from '@/components/LinkButton'
import { PageLayout } from '@/components/PageLayout'

import Content from '@/content/homepage.mdx'

export default function Home() {
  return (
    <PageLayout>

      <Grid container spacing={2} padding={2}
        justifyContent="center"
        alignItems="center">
        <Grid item xs={6}>
          <Card sx={{ fontFamily: 'arial', padding: 2 }}>
          <Content />
        </Card>
      </Grid>
      <Grid item xs={3}>
        <LinkButton href="./game-loader" variant='contained'>game loader</LinkButton>
      </Grid>
      <Grid item xs={3}>
        <LinkButton href="./prebuilt-game" variant='contained'>prebuilt game</LinkButton>
      </Grid>
    </Grid>

    </PageLayout >
  )
}
