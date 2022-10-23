/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { listIds } from "../../lib/util";
import { GameDesign } from "../../definitions/Game";
import { SelectInput, StringInput } from "./formControls";
import { FlagMapControl } from "./FlagMapControl";
import { EditorHeading } from "./EditorHeading";

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


      <EditorHeading heading="main" />
      <section style={{ display: 'flex', flexWrap: 'wrap' }}>

        <fieldset>

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
        </fieldset>
        <ul>
          <li>rooms: {gameDesign.rooms.length}</li>
          <li>items: {gameDesign.items.length}</li>
          <li>actors: {gameDesign.actors.length}</li>
          <li>conversations: {gameDesign.conversations.length}</li>
          <li>sprites: {gameDesign.sprites.length}</li>
          <li>interactions: {gameDesign.interactions.length}</li>
          <li>sequences: {gameDesign.sequences.length}</li>
          <li>endings: {gameDesign.endings.length}</li>
        </ul>
      </section>

      <br />
      <EditorHeading heading="Flags" />
      <section style={{ maxWidth: '35em' }}>
        <FlagMapControl gameDesign={gameDesign} edit={edit} />
      </section>

    </article>
  );
};
