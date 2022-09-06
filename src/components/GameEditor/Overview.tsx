/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { eventToString, listIds } from "../../lib/util";
import { GameDesign } from "../../definitions/Game";
import { SelectInput, TextInput } from "./formControls";
import { FlagMapControl } from "./FlagMapControl";

interface Props {
  gameDesign: GameDesign;
  edit: { (property: keyof GameDesign, value: unknown): void };
}

export const Overview: FunctionalComponent<Props> = ({
  gameDesign,
  edit,
}: Props) => {

  return (
    <article>
      <h2>Main</h2>
      <TextInput
        value={gameDesign.id}
        label="Game ID"
        onInput={(event) => {
          edit("id", eventToString(event));
        }}
      />

      <SelectInput
        value={gameDesign.currentRoomId}
        label={"Starting Room"}
        items={listIds(gameDesign.rooms)}
        onSelect={(value) => {
          edit("currentRoomId", value);
        }}
      />

      <ul>
        <li>rooms: {gameDesign.rooms.length}</li>
        <li>items: {gameDesign.items.length}</li>
        <li>actors: {gameDesign.actors.length}</li>
        <li>conversations: {gameDesign.conversations.length}</li>
        <li>sprites: {gameDesign.sprites.length}</li>
        <li>sprite sheets: {gameDesign.spriteSheets.length}</li>
        <li>interactions: {gameDesign.interactions.length}</li>
        <li>sequences: {gameDesign.sequences.length}</li>
        <li>endings: {gameDesign.endings.length}</li>
      </ul>

      <fieldset style={{ maxWidth: '35em' }}>
        <legend>Flags</legend>
        <FlagMapControl gameDesign={gameDesign} edit={edit} />
      </fieldset>
    </article>
  );
};
