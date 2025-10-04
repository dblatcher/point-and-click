import EditorLoader from '@/components/EditorLoader'
import { PageLayout } from '@/components/PageLayout'
import { basicTutorial } from '@/lib/tutorials/basic'

export default function EditorTutorialPage() {
  return (
    <PageLayout noPageScroll>
      <EditorLoader tutorial={basicTutorial} />
    </PageLayout>
  )
}
