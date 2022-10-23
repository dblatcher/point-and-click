/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h, Fragment } from "preact";
import { GameDesign, Verb } from "../../index";
import { ListEditor } from "./ListEditor";
import { VerbMenu } from "../VerbMenu";
import { EditorHeading } from "./EditorHeading";


interface Props {
    gameDesign: GameDesign;
    updateData: { (data: Verb[]): void };
}

export const VerbMenuEditor: FunctionalComponent<Props> = ({
    gameDesign,
    updateData,
}: Props) => {

    return (<>
        <EditorHeading heading="Verb Menu" helpTopic="verb menu" />
        <section style={{ maxWidth: '35em' }}>

            <ListEditor noDeleteButtons
                list={gameDesign.verbs}
                mutateList={(list) => { updateData(list) }}
                describeItem={(verb, index) => (
                    <span key={index}>{verb.id} : {verb.label}</span>
                )}
            />

            <fieldset>
                <legend>preview</legend>
                <VerbMenu
                    verbs={gameDesign.verbs}
                    currentVerbId={gameDesign.verbs[0] ? gameDesign.verbs[0].id : ''}
                    select={() => { }}
                />
            </fieldset>
        </section>

    </>)
}