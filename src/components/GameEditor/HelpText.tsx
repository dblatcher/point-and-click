import { FunctionComponent } from "react";
import { MarkDown } from "../MarkDown";
import itemsHelp from "@/content/editor-help/items.md"
import actorsHelp from "@/content/editor-help/actors.md"
import narrativeHelp from "@/content/editor-help/narrative.md"
import choiceSequences from "@/content/editor-help/conversation-choice-sequences.md"
import flagsHelp from "@/content/editor-help/flags.md"
import flagsConditionHelp from "@/content/editor-help/flag-conditions-help.md"
import roomSoundsHelp from "@/content/editor-help/room-sounds-help.md"

interface Props {
    topic: string;
}

export const HelpText: FunctionComponent<Props> = ({
    topic
}: Props) => {

    switch (topic) {
        case 'items':
            return <MarkDown content={itemsHelp} />
        case 'rooms':
            return (
                <article>
                    <p>Rooms are the places of any sort where the story takes place. Actors can be placed, and moved within rooms.</p>
                    <dl>
                        <dt>height</dt>
                        <dd>The height of the room.</dd>
                        <dt>width</dt>
                        <dd>The width of the room</dd>
                        <dt>frameWidth</dt>
                        <dd>The amount of the width of the room that is shown at once. If frameWidth=width, the whole room is seen at once.</dd>
                        <dt>background</dt>
                        <dd>Backgrounds...</dd>
                        <dt>hotspots</dt>
                        <dd>Areas of the room the player character can interact with</dd>
                        <dt>walkableAreas</dt>
                        <dd>Where actors can walk. If there are none, the whole room is considered walkable, except the obstacleAreas</dd>
                        <dt>obstacleAreas</dt>
                        <dd>Areas actors cannot walk. Places where obstacleAreas and walkableAreas overlap are NOT walkable.</dd>
                        <dt>scaling</dt>
                        <dd>How Actors in the room will be scaled up or down</dd>
                    </dl>
                </article>
            )
        case 'verb menu':
            return (
                <article>
                    <p>Use this control to change the order in which verbs will appear in the UI.</p>
                </article>
            )
        case 'actors':
            return <MarkDown content={actorsHelp} />
        case 'narrative':
            return <MarkDown content={narrativeHelp} />
        case 'conversation choice sequences':
            return <MarkDown content={choiceSequences} />
        case 'flag-conditions':
            return <>
                <MarkDown content={flagsConditionHelp} />
                <MarkDown content={flagsHelp} />
            </>
        case 'flags':
            return <MarkDown content={flagsHelp} />
        case 'room sounds':
            return <MarkDown content={roomSoundsHelp} />
        default:
            return (
                <article>
                    <p>No content about {topic}</p>
                </article>
            )
    }

}