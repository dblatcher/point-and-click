import EditorLoader from '@/components/EditorLoader'
import { PageLayout } from '@/components/PageLayout'

export default function GameEditorPage() {
  return (
    <PageLayout noPageScroll>
        <EditorLoader usePrebuiltGame />
    </PageLayout>
  )
}
