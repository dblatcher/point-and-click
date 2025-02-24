import { DesignServicesIcon } from '@/components/GameEditor/material-icons';
import { useAssets } from '@/context/asset-context';
import { useGameDesign } from "@/context/game-design-context";
import { usePageMeta } from "@/context/page-meta-context";
import { listIds } from "@/lib/util";
import { Box, Button, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useEffect } from "react";
import { tabOrder } from "../../lib/editor-config";
import { SelectInput } from '../SchemaForm/SelectInput';
import { DelayedStringInput } from './DelayedStringInput';
import { EditorBox } from "./EditorBox";
import { EditorHeading } from "./EditorHeading";
import { FlagMapControl } from "./FlagMapControl";
import { HelpButton } from "./HelpButton";

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
    <Stack gap={2}>
      <EditorHeading heading={mainTab?.label ?? 'main'} />

      <EditorBox title='game details'>
        <DelayedStringInput label='Game Id' value={gameDesign.id} optional
          inputHandler={(id) => {
            applyModification(`Change game id to "${id}"`, { id })
          }} />
        <DelayedStringInput label='description' value={gameDesign.description ?? ''} optional type='textArea'
          inputHandler={(description) => {
            applyModification(`Change description to "${description}"`, { description })
          }} />
      </EditorBox>

      <Box display={'flex'} flexWrap={'wrap'} gap={2} alignItems={'flex-start'}>
        <EditorBox title="starting conditions" contentBoxProps={{ minWidth: 160, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <SelectInput optional label='Starting Room'
            value={gameDesign.currentRoomId}
            inputHandler={currentRoomId => applyModification(`Change starting room to ${currentRoomId}`, { currentRoomId })}
            options={listIds(gameDesign.rooms)} />
          <SelectInput optional label='Opening Seqeunce'
            value={gameDesign.openingSequenceId}
            inputHandler={openingSequenceId => applyModification(`Change opening sequence to ${openingSequenceId}`, { openingSequenceId })}
            options={listIds(gameDesign.sequences)} />
          <SelectInput optional label='Title Board'
            value={gameDesign.openingStoryboardId}
            inputHandler={openingStoryboardId => applyModification(`Change Title board to ${openingStoryboardId}`, { openingStoryboardId })}
            options={listIds(gameDesign.storyBoards ?? [])} />
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
                      {tab.itemType && "x" + (gameDesign[tab.itemType] ?? []).length}
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
