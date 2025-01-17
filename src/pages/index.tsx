import { Box, Card, Grid, Stack, Typography } from '@mui/material'
import { LinkButton } from '@/components/LinkButton'
import { PageLayout } from '@/components/PageLayout'

import content from "@/content/homepage.md";
import featuresAndDetails from "@/content/featuresAndDetails.md";
import { MarkDown } from '@/components/MarkDown';


export default function Home() {
  return (
    <PageLayout>

      <Grid container spacing={2} padding={2}
        justifyContent="center"
        alignItems="center">
        <Grid item xs={6}>
          <Card sx={{
            padding: 2,
          }}>
            <MarkDown content={content} />
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Stack gap={2}>
            <LinkButton href="./game-loader" variant='contained'>game loader</LinkButton>
            <LinkButton href="./prebuilt-game" variant='contained'>prebuilt game</LinkButton>
            <LinkButton href="./editor" variant='contained'>game designer</LinkButton>
          </Stack>
        </Grid>
      </Grid>

      <Box padding={2}>
        <Card sx={{
          padding: 2,
        }}>
          <MarkDown content={featuresAndDetails} />
        </Card>
      </Box>

    </PageLayout >
  )
}
