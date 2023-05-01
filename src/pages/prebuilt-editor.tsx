import EditorLoader from '@/components/EditorLoader'
import { PageLayout } from '@/components/PageLayout'

export default function GameEditorPage() {
  return (
    <PageLayout>
      <EditorLoader usePrebuiltGame />
    </PageLayout>
  )
}
