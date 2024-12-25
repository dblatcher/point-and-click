import { UndoIcon } from "@/components/GameEditor/material-icons";
import { GameDesign } from "@/definitions/Game";
import { Badge, IconButton, Tooltip } from "@mui/material";
import { FunctionComponent } from "react";

interface Props {
  undo: { (): void };
  history: { gameDesign: GameDesign; label: string }[];
}

export const UndoButton: FunctionComponent<Props> = ({
  undo,
  history,
}: Props) => {
  const undoLabel = history.length > 0 ? `undo ${history[history.length - 1]?.label}` : 'undo'

  return (
    <Tooltip title={undoLabel}>
      <IconButton aria-label={undoLabel} onClick={undo}>
        <Badge badgeContent={history.length} color='primary'>
          <UndoIcon fontSize="large" />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};
