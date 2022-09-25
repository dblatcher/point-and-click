/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { listIds } from "../../lib/util";
import { GameDesign } from "../../definitions/Game";
import { SelectInput, StringInput } from "./formControls";
import { FlagMapControl } from "./FlagMapControl";
import { ListEditor } from "./ListEditor";
import { VerbMenu } from "../VerbMenu";

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

      <fieldset style={{ maxWidth: '35em' }}>
        <legend>Flags</legend>
        <FlagMapControl gameDesign={gameDesign} edit={edit} />
      </fieldset>

      <fieldset style={{ maxWidth: '35em' }}>
        <legend>Verb Menu</legend>

        <ListEditor noDeleteButtons
          list={gameDesign.verbs}
          mutateList={(list) => { edit('verbs', list) }}
          describeItem={(verb, index) => (
            <span key={index}>{verb.id} : {verb.label}</span>
          )}
        />

        <VerbMenu
          verbs={gameDesign.verbs}
          currentVerbId={gameDesign.verbs[0] ? gameDesign.verbs[0].id : ''}
          select={() => { }}
        />
      </fieldset>
    </article>
  );
};
