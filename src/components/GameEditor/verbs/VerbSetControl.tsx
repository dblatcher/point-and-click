import { useGameDesign } from "@/context/game-design-context"
import { tabIcons } from "@/lib/editor-config"
import { findById } from "@/lib/util"
import { EditorHeading } from "../layout/EditorHeading"
import { LayoutControls, LayoutHolder, LayoutItem } from "../layout/SplitLayout"
import { VerbEditor } from "./VerbEditor"
import { VerbListControl } from "./VerbListControl"
import { useEffect } from "react"


export const VerbSetControl = () => {
    const { dispatchDesignUpdate, gameItemIds: { verbs: currentVerbId }, gameDesign: { verbs } } = useGameDesign()
    const currentVerb = findById(currentVerbId, verbs)

    useEffect(() => {
        if (!currentVerbId) {
            dispatchDesignUpdate({ type: 'open-in-editor', tabId: 'verbs', itemId: verbs[0]?.id })
        }
    }, [])

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