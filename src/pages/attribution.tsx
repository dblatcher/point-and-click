import { MarkDown } from '@/components/MarkDown'
import { PageLayout } from '@/components/PageLayout'
import attributionListContent from '@/content/attributionList.md'
import { Box } from '@mui/material'

export default function AttributionPage() {
    return (
        <PageLayout >
            <Box padding={2}>
                <MarkDown content={attributionListContent} />
            </Box>
        </PageLayout>
    )
}
