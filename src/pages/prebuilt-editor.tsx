import EditorLoader from '@/components/EditorLoader'
import { PageLayout } from '@/components/PageLayout'

export default function GameEditorPage() {
  return (
    <PageLayout noPageScroll>
      <EditorLoader
        // usePrebuiltGame
        tutorial={{ 
          title: 'test tutorial',
          designId:'simple-template',
        }}
      />
    </PageLayout>
  )
}
