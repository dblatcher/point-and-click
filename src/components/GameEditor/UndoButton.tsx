import { UndoIcon } from "@/components/GameEditor/material-icons";
import { useGameDesign } from "@/context/game-design-context";
import { GameDesign } from "@/definitions/Game";
import { Badge, IconButton, Tooltip } from "@mui/material";
import { FunctionComponent } from "react";

interface Props {
  history: { gameDesign: GameDesign; label: string }[];
}

export const UndoButton: FunctionComponent<Props> = ({
  history,
}: Props) => {
  const { dispatchDesignUpdate } = useGameDesign()
  const undoLabel = history.length > 0 ? `undo ${history[history.length - 1]?.label}` : 'undo'

  return (
    <Tooltip title={undoLabel}>
      <IconButton aria-label={undoLabel} 
        onClick={() => dispatchDesignUpdate({ type: 'undo' })}>
        <Badge badgeContent={history.length} color='primary'>
          <UndoIcon fontSize="large" />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};
