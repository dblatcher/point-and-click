import { SchemaForm } from "@/components/SchemaForm";
import { FixedGameInfoSchema, GameContentsDataSchema, GameDesign } from "@/definitions/Game";
import { listIds } from "@/lib/util";
import { Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FunctionComponent } from "react";
import { EditorBox } from "./EditorBox";
import { EditorHeading } from "./EditorHeading";
import { FlagMapControl } from "./FlagMapControl";

interface Props {
  gameDesign: GameDesign;
  edit: { (property: keyof GameDesign, value: unknown): void };
}

const formSchema = GameContentsDataSchema.pick({
  id: true,
  currentRoomId: true,
}).merge(FixedGameInfoSchema.pick({
  openingSequenceId: true
}))

export const Overview: FunctionComponent<Props> = ({
  gameDesign,
  edit,
}: Props) => {

  return (
    <Stack>
      <EditorHeading heading="main" />
      <Stack direction={'row'} spacing={1} paddingY={1}>

        <EditorBox title="attributes">
          <SchemaForm
            schema={formSchema}
            data={gameDesign}
            changeValue={(value, field) => {
              switch (field.key) {
                case 'id':
                case 'currentRoomId':
                case 'openingSequenceId':
                  edit(field.key, value)
              }
            }}
            fieldAliases={{
              id: 'Game ID',
              currentRoomId: 'Starting Room',
              openingSequenceId: 'Opening Sequence',
            }}
            options={{
              currentRoomId: listIds(gameDesign.rooms),
              openingSequenceId: listIds(gameDesign.sequences)
            }}
            fieldWrapperProps={{ spacing: 2 }}
          />
        </EditorBox>

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
