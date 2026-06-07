import { useGameDesign } from "@/context/game-design-context";
import { tabIcons, TabId } from "@/lib/editor-config";
import { Button, ButtonProps } from "@mui/material";
import { Consequence } from "point-click-lib";
import { ShortCutIcon } from "./material-icons";

type EditorShortcutProps = Omit<ButtonProps, 'children' | 'startIcon' | 'onClick' | 'disabled'> & {
    itemType: TabId;
    itemId?: string | undefined;
}

export const EditorShortcut = ({ itemId, itemType, ...buttonProps }: EditorShortcutProps) => {

    const { openInEditor } = useGameDesign()

    const Icon = tabIcons[itemType]

    return <Button
        aria-label={itemId ? `edit ${itemId}(${itemType})` : `shortcut to ${itemType}`}
        startIcon={<ShortCutIcon />}
        endIcon={Icon && <Icon />}
        onClick={() => openInEditor(itemType, itemId)}
        variant="outlined"
        disabled={!itemId}
        {...buttonProps}
    >{itemId ?? itemType}</Button>
}

type EditorInteractionShortcutProps = Omit<ButtonProps, 'children' | 'startIcon' | 'onClick' | 'disabled'> & {
    interactionIndex: number,
    label?: string,
}

export const EditorInteractionShortcut = ({ interactionIndex, label, ...buttonProps }: EditorInteractionShortcutProps) => {
    const { dispatchDesignUpdate } = useGameDesign()
    const Icon = tabIcons['interactions']
    const displayText = label ?? `interaction ${interactionIndex + 1}`

    return <Button
        aria-label={label ?? `edit interaction(${interactionIndex + 1})`}
        startIcon={<ShortCutIcon />}
        endIcon={Icon && <Icon />}
        onClick={() => dispatchDesignUpdate({ type: 'set-interaction-index', interactionIndex })}
        variant="outlined"
        {...buttonProps}
    >{displayText}</Button>
}

export const ShortcutsForConsequence = ({ consequence }: { consequence: Consequence }) => {
    return <>
        {'sequence' in consequence && (
            <EditorShortcut
                itemType='sequences'
                itemId={consequence.sequence} />
        )}
        {'storyBoardId' in consequence && (
            <EditorShortcut
                itemType='storyBoards'
                itemId={consequence.storyBoardId} />
        )}
        {('conversationId' in consequence) && (
            <EditorShortcut
                itemType='conversations'
                itemId={consequence.conversationId} />
        )}
        {'actorId' in consequence && (
            <EditorShortcut
                itemType='actors'
                itemId={consequence.actorId} />
        )}
    </>
}