import EditorLoader from '@/components/EditorLoader'
import { PageLayout } from '@/components/PageLayout'
import { basicTutorial } from '@/lib/tutorials/basic'

export default function GameEditorPage() {
  return (
    <PageLayout noPageScroll>
      <EditorLoader
        // usePrebuiltGame
        tutorial={basicTutorial}
      />
    </PageLayout>
  )
}
