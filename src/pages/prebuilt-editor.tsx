import EditorLoader from '@/components/EditorLoader'
import { PageLayout } from '@/components/PageLayout'

export default function GameEditorPage() {
  return (
    <PageLayout noPageScroll>
      <EditorLoader
        // usePrebuiltGame
        tutorial={{
          title: 'test tutorial',
          designId: 'simple-template',
          stages: [
            {
              intro: 'Welcome to Point and Click. In this tutoial, you will be adding an interaction.',
              tasks: [
                {
                  title: 'open the interactions menu',
                  detail: 'click the menu on the left or use the 5 key',
                  test(state) {
                    return state.tabOpen === 'interactions'
                  },
                },
                {
                  title: 'create an interaction',
                  test(state) {
                    return state.gameDesign.interactions.length > 0
                  },
                }
              ],
              confirmation: 'Well done.'
            }
          ]
        }}
      />
    </PageLayout>
  )
}
