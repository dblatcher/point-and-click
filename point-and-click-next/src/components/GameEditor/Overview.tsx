
import { FunctionComponent } from "react";
import { Table, TableBody, TableCell, TableRow, Stack, Box, Paper, TableContainer } from "@mui/material"
import { listIds } from "@/lib/util";
import { GameDesign } from "@/oldsrc/definitions/Game";
import { SelectInput, StringInput } from "./formControls";
import { FlagMapControl } from "./FlagMapControl";
import { EditorHeading } from "./EditorHeading";

interface Props {
  gameDesign: GameDesign;
  edit: { (property: keyof GameDesign, value: unknown): void };
}

export const Overview: FunctionComponent<Props> = ({
  gameDesign,
  edit,
}: Props) => {

  return (
    <Stack>
      <EditorHeading heading="main" />
      <Stack direction={'row'} spacing={1} paddingY={1}>

        <Box>
          <StringInput block
            value={gameDesign.id}
            label="Game ID"
            inputHandler={(value) => {
              edit("id", value);
            }}
          />

          <SelectInput block
            value={gameDesign.currentRoomId}
            label={"Starting Room"}
            items={listIds(gameDesign.rooms)}
            onSelect={(value) => {
              edit("currentRoomId", value);
            }}
          />

          <SelectInput block
            value={gameDesign.openingSequenceId || ''}
            label={"OpeningSequence"}
            haveEmptyOption={true}
            emptyOptionLabel="[none]"
            items={listIds(gameDesign.sequences)}
            onSelect={(value) => {
              edit("openingSequenceId", value);
            }}
          />
        </Box>

        <TableContainer component={Paper} sx={{ width: 'unset' }}>
          <Table size="small"  >
            <TableBody>
              <TableRow>
                <TableCell>rooms</TableCell><TableCell>{gameDesign.rooms.length}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>items</TableCell><TableCell>{gameDesign.items.length}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>actors</TableCell><TableCell>{gameDesign.actors.length}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>conversations</TableCell><TableCell>{gameDesign.conversations.length}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>sprites</TableCell><TableCell>{gameDesign.sprites.length}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>interactions</TableCell><TableCell>{gameDesign.interactions.length}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>sequences</TableCell><TableCell>{gameDesign.sequences.length}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>endings</TableCell><TableCell>{gameDesign.endings.length}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      <EditorHeading heading="Flags" />
      <FlagMapControl gameDesign={gameDesign} edit={edit} />

    </Stack>
  );
};
