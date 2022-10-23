import { FunctionalComponent, h } from "preact";

interface Props {
    topic: string;
}


export const HelpText: FunctionalComponent<Props> = ({
    topic
}: Props) => {

    switch (topic) {
        case 'items':
            return (
                <article>
                    <p>Items represent anything a character can have in their inventory.</p>
                    <p>The same thing in the game might also be represented by an Actor which the player can 'pick up'.</p>
                    <dl>
                        <dt>name</dt>
                        <dd>The display name for the item in the UI</dd>
                        <dt>actorId (optional)</dt>
                        <dd>The id of the Actor holding the item (undefined = no actor initially holding the item)</dd>
                        <dt>picture (optional)</dt>
                        <dd>The id of the image asset to use for this item.</dd>
                        <dt>row & col</dt>
                        <dd>If the picture is an image multiple frames, the co-ordinates of the frame to use.</dd>
                    </dl>
                </article>
            )
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
        default:
            return (
                <article>
                    <p>No content about {topic}</p>
                </article>
            )
    }

}