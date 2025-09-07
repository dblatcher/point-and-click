import { useGameDesign } from "@/context/game-design-context";
import { Box, Stack } from "@mui/material";
import { tabOrder } from "../../lib/editor-config";
import { DelayedStringInput } from './DelayedStringInput';
import { EditorBox } from "./EditorBox";
import { EditorHeading } from "./EditorHeading";
import { FlagMapControl } from "./FlagMapControl";
import { HelpButton } from "./HelpButton";
import { StartingConditionsForm } from './StartingConditionsForm';
import { StartingInventory } from './StartingInventory';

export const Overview = () => {
  const { gameDesign, applyModification } = useGameDesign();

  const mainTab = tabOrder.find(tab => tab.id === 'main')

  return (
    <Stack gap={2}>
      <EditorHeading heading={mainTab?.label ?? 'main'} />

      <EditorBox
        title='game details'
        contentBoxProps={{ display: 'flex', gap: 4 }}
      >
        <div>
          <DelayedStringInput label='Game Id' value={gameDesign.id} optional
            inputHandler={(id) => {
              applyModification(`Change game id to "${id}"`, { id })
            }} />
          <DelayedStringInput label='description' value={gameDesign.description ?? ''} optional type='textArea'
            inputHandler={(description) => {
              applyModification(`Change description to "${description}"`, { description })
            }} />
        </div>
        <StartingConditionsForm />
      </EditorBox>

      <Box display={'flex'} flexWrap={'wrap'} gap={2} alignItems={'flex-start'}>
        <EditorBox title="Flags" barContent={<HelpButton helpTopic={'flags'} />}>
          <FlagMapControl />
        </EditorBox>
        <StartingInventory />
      </Box>
    </Stack>
  );
};
