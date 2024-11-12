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
import { useAssets } from '@/context/asset-context';

const formSchema = GameContentsDataSchema.pick({
  id: true,
  currentRoomId: true,
}).merge(FixedGameInfoSchema.pick({
  openingSequenceId: true,
  openingStoryboardId: true,
}))

export const Overview = () => {
  const { gameDesign, openInEditor, applyModification } = useGameDesign();
  const { soundAssets, imageAssets } = useAssets()
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
                  if (typeof value === 'string') {
                    applyModification(`Change ${field.key} to "${value}"`, { [field.key]: value })
                  }
                  break
                case 'openingSequenceId':
                case 'openingStoryboardId':
                  if (typeof value === 'string') {
                    applyModification(`Change ${field.key} to "${value}"`, { [field.key]: value })
                  } else {
                    applyModification(`Change ${field.key} to "NONE"`, { [field.key]: undefined })
                  }
              }
            }}
            fieldAliases={{
              id: 'Game ID',
              currentRoomId: 'Starting Room',
              openingSequenceId: 'Opening Sequence',
              openingStoryboardId: 'Title Board',
            }}
            options={{
              currentRoomId: listIds(gameDesign.rooms),
              openingSequenceId: listIds(gameDesign.sequences),
              openingStoryboardId: listIds(gameDesign.storyBoards ?? [])
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
                      {tab.id === 'sounds' && `x${soundAssets.length}`}
                      {tab.id === 'images' && `x${imageAssets.length}`}
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
