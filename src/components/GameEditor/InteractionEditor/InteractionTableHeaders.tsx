import { TableRow, TableCell } from "@mui/material";

export const InteractionTableHeaders: React.FunctionComponent = () => (
    <TableRow>
        <TableCell>verb</TableCell>
        <TableCell>target</TableCell>
        <TableCell>item</TableCell>
        <TableCell>room</TableCell>
        <TableCell rowSpan={2}>consequences</TableCell>
        <TableCell rowSpan={2} style={{ width: '4em' }}>must be true</TableCell>
        <TableCell rowSpan={2} style={{ width: '4em' }}>must be false</TableCell>
    </TableRow>
)