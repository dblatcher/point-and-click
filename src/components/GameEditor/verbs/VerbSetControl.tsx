import { useGameDesign } from "@/context/game-design-context"
import { tabIcons } from "@/lib/editor-config"
import { findById } from "@/lib/util"
import { EditorHeading } from "../layout/EditorHeading"
import { LayoutControls, LayoutHolder, LayoutItem } from "../layout/SplitLayout"
import { VerbEditor } from "./VerbEditor"
import { VerbListControl } from "./VerbListControl"


export const VerbSetControl = () => {
    const { gameItemIds: { verbs: currentVerbId }, gameDesign: { verbs } } = useGameDesign()
    const currentVerb = findById(currentVerbId, verbs)
    return (
        <>
            <EditorHeading heading={'Verbs'} icon={tabIcons.verbs} helpTopic={'verbs'} />
            <LayoutHolder>
                <LayoutControls>
                    <VerbListControl />
                </LayoutControls>
                <LayoutItem>
                    {currentVerb && <VerbEditor verb={currentVerb} />}
                </LayoutItem>
            </LayoutHolder>
        </>
    )
}