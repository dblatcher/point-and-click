import { TableRow, TableCell } from "@mui/material";

export const InteractionTableHeaders: React.FunctionComponent = () => (
    <TableRow>
        <TableCell>verb</TableCell>
        <TableCell>target</TableCell>
        <TableCell>item</TableCell>
        <TableCell>room</TableCell>
        <TableCell rowSpan={2}>Consequences</TableCell>
        <TableCell rowSpan={2}>Conditions</TableCell>
    </TableRow>
)