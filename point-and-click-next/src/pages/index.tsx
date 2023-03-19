import { Box, Typography, Grid } from '@mui/material'
import { LinkButton } from '@/components/LinkButton'
import { PageLayout } from '@/components/PageLayout'

export default function Home() {
  return (
    <PageLayout>

      <Box>
        <Typography>
          This is the homepage.
        </Typography>
      </Box>


      <Grid container spacing={2}
        justifyContent="center"
        alignItems="center">
        <Grid item xs={6}>
          <LinkButton href="./game-loader" variant='contained'>game loader</LinkButton>
        </Grid>
        <Grid item xs={6}>
          <LinkButton href="./prebuilt-game" variant='contained'>prebuilt game</LinkButton>
        </Grid>
      </Grid>

    </PageLayout>
  )
}
