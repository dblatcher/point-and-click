import { DesignServicesIcon } from '@/components/GameEditor/material-icons';
import { useAssets } from '@/context/asset-context';
import { useGameDesign } from "@/context/game-design-context";
import { usePageMeta } from "@/context/page-meta-context";
import { Box, Button, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useEffect } from "react";
import { tabOrder } from "../../lib/editor-config";
import { DelayedStringInput } from './DelayedStringInput';
import { EditorBox } from "./EditorBox";
import { EditorHeading } from "./EditorHeading";
import { FlagMapControl } from "./FlagMapControl";
import { HelpButton } from "./HelpButton";
import { StartingConditionsForm } from './StartingConditionsForm';
import { StartingInventory } from './StartingInventory';

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
        <p>schema number: {gameDesign.schemaVersion}</p>
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
        <StartingConditionsForm />
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
        <StartingInventory />
      </Box>
    </Stack>
  );
};
