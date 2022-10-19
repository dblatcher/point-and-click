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
        default:
            return (
                <article>
                    <p>No content about {topic}</p>
                </article>
            )
    }

}