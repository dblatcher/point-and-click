import { UndoIcon, RedoIcon } from "@/components/GameEditor/material-icons";
import { useGameDesign } from "@/context/game-design-context";
import { GameDesign } from "@/definitions/Game";
import { Badge, IconButton, Tooltip } from "@mui/material";
import { FunctionComponent } from "react";

interface Props {
  history: { gameDesign: GameDesign; label: string }[];
  undoneHistory: { gameDesign: GameDesign; label: string }[];
}

export const UndoAndRedoButtons: FunctionComponent<Props> = ({
  history, undoneHistory
}: Props) => {
  const { dispatchDesignUpdate } = useGameDesign()
  const undoLabel = history.length > 0 ? `undo ${history[history.length - 1]?.label}` : 'undo'
  const redoLabel = undoneHistory.length > 0 ? `redo ${undoneHistory[undoneHistory.length - 1]?.label}` : 'redo'

  return (
    <>
      <Tooltip title={undoLabel}>
        <span>
          <IconButton aria-label={undoLabel} disabled={history.length === 0}
            onClick={() => dispatchDesignUpdate({ type: 'undo' })}>
            <Badge badgeContent={history.length} color='primary'>
              <UndoIcon fontSize="large" />
            </Badge>
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={redoLabel}>
        <span>
          <IconButton aria-label={redoLabel} disabled={undoneHistory.length === 0}
            onClick={() => dispatchDesignUpdate({ type: 'redo' })}
          >
            <Badge badgeContent={undoneHistory.length} color='primary'>
              <RedoIcon fontSize="large" />
            </Badge>
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};
