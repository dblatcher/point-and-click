import { useGameDesign } from "@/context/game-design-context";
import { tabIcons, TabId } from "@/lib/editor-config";
import { Button, ButtonProps } from "@mui/material";
import { Consequence } from "point-click-lib";
import { ShortCutIcon } from "./material-icons";

type Props = Omit<ButtonProps, 'children' | 'startIcon' | 'onClick' | 'disabled'> & {
    itemType: TabId;
    itemId?: string | undefined;
}

export const EditorShortcut = ({ itemId, itemType, ...buttonProps }: Props) => {

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