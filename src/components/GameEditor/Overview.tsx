import { useGameDesign } from "@/context/game-design-context";
import { Box, Stack } from "@mui/material";
import { tabOrder } from "../../lib/editor-config";
import { DelayedStringInput } from './DelayedStringInput';
import { EditorBox } from "./layout/EditorBox";
import { EditorHeading } from "./layout/EditorHeading";
import { FlagMapControl } from "./FlagMapControl";
import { HelpButton } from "./HelpButton";
import { StartingConditionsForm } from './StartingConditionsForm';
import { StartingInventory } from './StartingInventory';
import { FileAssetSelector } from "./FileAssetSelector";
import { ImageBlock } from "../ImageBlock";
import { ImageAsset } from "@/services/assets";
import { HideImageOutlinedIcon } from "./material-icons";

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

          <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>

            <FileAssetSelector
              selectedItemId={gameDesign.thumbnailAssetId}
              format="select"
              filterItems={(asset) => {
                const imageAsset = asset as ImageAsset;
                return !imageAsset.cols && !imageAsset.rows;
              }}
              assetType="image"
              legend="thumbnail"
              selectNone={() => {
                applyModification(`Unset Thumbnail}`, { thumbnailAssetId: undefined })
              }}
              select={(asset) => {
                applyModification(`Set thumbnail asset to ${asset.id}`, { thumbnailAssetId: asset.id })
              }} />

            <Box height={50} width={50} display={'flex'} justifyContent={'center'} alignItems={'center'}>
              {gameDesign.thumbnailAssetId ? (
                <ImageBlock frame={{ imageId: gameDesign.thumbnailAssetId }} fitHeight />
              ) : (
                <HideImageOutlinedIcon sx={{ width: 40, height: 40 }} />
              )}
            </Box>
          </Box>
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
