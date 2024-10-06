import { DesignServicesIcon } from '@/components/GameEditor/material-icons';
import { SchemaForm } from "@/components/SchemaForm";
import { useGameDesign } from "@/context/game-design-context";
import { usePageMeta } from "@/context/page-meta-context";
import { FixedGameInfoSchema, GameContentsDataSchema } from "@/definitions/Game";
import { listIds } from "@/lib/util";
import { Box, Button, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useEffect } from "react";
import { tabOrder } from "../../lib/editor-config";
import { EditorBox } from "./EditorBox";
import { EditorHeading } from "./EditorHeading";
import { FlagMapControl } from "./FlagMapControl";
import { HelpButton } from "./HelpButton";

const formSchema = GameContentsDataSchema.pick({
  id: true,
  currentRoomId: true,
}).merge(FixedGameInfoSchema.pick({
  openingSequenceId: true
}))

export const Overview = () => {
  const { gameDesign, openInEditor, applyModification } = useGameDesign();
  const { setHeaderContent } = usePageMeta();

  const mainTab = tabOrder.find(tab => tab.id === 'main')

  useEffect(() => {
    setHeaderContent(
      <Stack direction={'row'}>
        <DesignServicesIcon />
        <Typography variant="h2" noWrap sx={{ fontSize: '120%', margin: 0 }}>
          {gameDesign.id}
        </Typography>
      </Stack>
    )
  }, [gameDesign.id, setHeaderContent])

  return (
    <Stack>
      <EditorHeading heading={mainTab?.label ?? 'main'} />
      <Box display={'flex'} flexWrap={'wrap'} gap={2} alignItems={'flex-start'}>
        <EditorBox title="attributes">
          <SchemaForm
            schema={formSchema}
            data={gameDesign}
            changeValue={(value, field) => {
              switch (field.key) {
                case 'id':
                case 'currentRoomId':
                case 'openingSequenceId':
                  if (typeof value === 'string') {
                    applyModification(`Change ${field.key} to "${value}"`, { [field.key]: value })
                  }
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
        <EditorBox title="contents">
          <TableContainer sx={{ width: 'unset' }}>
            <Table size="small" >
              <TableBody>
                {tabOrder.filter(tab => tab !== mainTab).map(tab => (
                  <TableRow key={tab.id}>
                    <TableCell>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => openInEditor(tab.id, undefined)}
                      >{tab.label}</Button>
                    </TableCell>
                    <TableCell>
                      {tab.itemType && "x" + gameDesign[tab.itemType].length}
                      {tab.id === 'interactions' && `x${gameDesign.interactions.length}`}
                    </TableCell>
                    <TableCell>
                      {tab.helpTopic &&
                        <HelpButton helpTopic={tab.helpTopic} />
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </EditorBox>
        <EditorBox title="Flags" barContent={<HelpButton helpTopic={'flags'} />}>
          <FlagMapControl />
        </EditorBox>
      </Box>
    </Stack>
  );
};
