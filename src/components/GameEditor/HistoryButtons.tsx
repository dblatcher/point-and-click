import { UndoIcon, RedoIcon, NavigateBeforeIcon, NavigateNextIcon } from "@/components/GameEditor/material-icons";
import { useGameDesign } from "@/context/game-design-context";
import { GameDesign } from "point-click-lib";
import { Badge, ButtonProps, IconButton, Tooltip } from "@mui/material";
import { GameEditorState } from "@/lib/game-design-logic/types";

interface HistoryButtonProps {
  label: string;
  length: number;
  onClick: ButtonProps['onClick'];
  Icon: typeof UndoIcon;
}
const HistoryButton = ({ label, length, onClick, Icon }: HistoryButtonProps) => {
  return (
    <Tooltip title={label}>
      <span>
        <IconButton aria-label={label} disabled={length === 0}
          onClick={onClick}>
          <Badge badgeContent={length} color='primary'>
            <Icon />
          </Badge>
        </IconButton>
      </span>
    </Tooltip>
  )
}

interface UndoRedoProps {
  history: { gameDesign: GameDesign; label: string }[];
  undoneHistory: { gameDesign: GameDesign; label: string }[];
}
export const UndoAndRedoButtons = ({
  history, undoneHistory
}: UndoRedoProps) => {
  const { dispatchDesignUpdate } = useGameDesign()
  const undoLabel = history.length > 0 ? `undo ${history[history.length - 1]?.label}` : 'undo'
  const redoLabel = undoneHistory.length > 0 ? `redo ${undoneHistory[undoneHistory.length - 1]?.label}` : 'redo'

  return (
    <>
      <HistoryButton label={undoLabel}
        length={history.length}
        onClick={() => dispatchDesignUpdate({ type: 'undo' })}
        Icon={UndoIcon} />
      <HistoryButton label={redoLabel}
        length={undoneHistory.length}
        onClick={() => dispatchDesignUpdate({ type: 'redo' })}
        Icon={RedoIcon} />
    </>
  );
};

type NavigationButtonProps = Pick<GameEditorState, 'navigationStackBack' | 'navigationStackForward'>
export const NavigationButtons = ({ navigationStackBack = [], navigationStackForward = [] }: NavigationButtonProps) => {
  const { dispatchDesignUpdate } = useGameDesign()

  const getLabel = (history: GameEditorState['navigationStackForward']): string => {
    const lastItem = (history ?? []).toReversed()[0]
    if (!lastItem) {
      return 'none'
    }
    const { tabOpen, gameItemIds } = lastItem;
    let itemId: string | undefined = undefined;
    switch (tabOpen) {
      case "main":
      case "images":
      case "sounds":
      case "interactions":
        break;
      case "rooms":
      case "items":
      case "actors":
      case "conversations":
      case "sprites":
      case "sequences":
      case "verbs":
      case "storyBoards":
        itemId = gameItemIds[tabOpen]
    }

    return itemId ? `go to ${tabOpen}/${itemId}` : `go to ${tabOpen}`;
  }

  return (
    <>
      <HistoryButton label={getLabel(navigationStackBack)}
        length={navigationStackBack.length}
        onClick={() => dispatchDesignUpdate({ type: 'go-back-in-editor' })}
        Icon={NavigateBeforeIcon} />
      <HistoryButton label={getLabel(navigationStackForward)}
        length={navigationStackForward.length}
        onClick={() => dispatchDesignUpdate({ type: 'go-forward-in-editor' })}
        Icon={NavigateNextIcon} />
    </>
  );

}