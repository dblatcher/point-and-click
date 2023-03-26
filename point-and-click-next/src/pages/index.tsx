import { Card, Grid, Typography } from '@mui/material'
import { LinkButton } from '@/components/LinkButton'
import { PageLayout } from '@/components/PageLayout'

import content from "@/content/homepage.md";
import { MarkDown } from '@/components/MarkDown';


export default function Home() {
  return (
    <PageLayout>

      <Grid container spacing={2} padding={2}
        justifyContent="center"
        alignItems="center">
        <Grid item xs={4}>
          <Card sx={{
            fontFamily: 'arial',
            padding: 2,
          }}>
            <MarkDown content={content} />
          </Card>
        </Grid>
        <Grid item xs={2}>
          <LinkButton href="./game-loader" variant='contained'>game loader</LinkButton>
        </Grid>
        <Grid item xs={2}>
          <LinkButton href="./prebuilt-game" variant='contained'>prebuilt game</LinkButton>
        </Grid>
        <Grid item xs={2}>
          <LinkButton href="./editor" variant='contained'>create game</LinkButton>
        </Grid>
      </Grid>

    </PageLayout >
  )
}
