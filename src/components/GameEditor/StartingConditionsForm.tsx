import { useGameDesign } from "@/context/game-design-context";
import { listIds } from "@/lib/util";
import { SelectInput } from "../SchemaForm/SelectInput";
import { EditorBox } from "./EditorBox";


export const StartingConditionsForm = () => {
    const { gameDesign, applyModification } = useGameDesign();
    return (
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
    )
}