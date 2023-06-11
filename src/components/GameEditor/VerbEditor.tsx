
import { FieldDef, FieldValue, SchemaForm, getModification } from "@/components/SchemaForm";
import { Command, CommandTarget, ItemData, Verb } from "@/definitions";
import { VerbSchema } from "@/definitions/Verb";
import { cloneData } from "@/lib/clone";
import { describeCommand, getDefaultResponseText, wildCard } from "@/lib/commandFunctions";
import { listIds } from "@/lib/util";
import { useState } from "react";
import { EditorHeading } from "./EditorHeading";
import { StorageMenu } from "./StorageMenu";
import { makeBlankVerb } from "./defaults";
import { useGameDesign } from "./game-design-context";


type Props = {
    data?: Verb,
}

const testTarget: CommandTarget = {
    type: 'hotspot',
    id: '(target)',
    name: '{{target}}',
    parallax: 0,
    status: '',
    circle: 0,
    x: 0, y: 0,
} as const;

const testItem: ItemData = {
    type: 'item',
    id: '(item)',
    name: '{{item}}',
}

export const VerbEditor = (props: Props) => {
    const { gameDesign, performUpdate, deleteArrayItem, options } = useGameDesign()
    const { data } = props

    const updateData = (data: Verb) => { performUpdate('verbs', data) }
    const deleteData = (index: number) => { deleteArrayItem(index, 'verbs') }

    const [verbState, setVerbState] = useState<Verb>(data ? {
        ...cloneData(data)
    } : makeBlankVerb())


    const initialData = data ? {
        ...cloneData(data)
    } : makeBlankVerb();

    const handleUpdate = (value: FieldValue, field: FieldDef): void => {
        const property = field.key as keyof Verb;

        const mod = getModification(value, field) as Partial<Verb>
        const updatedState = { ...verbState, ...mod }
        setVerbState(updatedState)


        if (options.autoSave && property !== 'id') {
            const isExistingId = listIds(gameDesign.verbs).includes(verbState.id)
            if (data && isExistingId) {
                updateData(updatedState)
            }
        }
    }

    const testCommandWithItem: Command = {
        verb: verbState,
        target: testTarget,
        item: testItem,
    }
    const testCommand: Command = {
        verb: verbState,
        target: testTarget,
    }


    return (

        <article>
            <EditorHeading heading="Verb Editor" itemId={initialData.id} />
            <StorageMenu
                type="Verb"
                update={() => updateData(cloneData(verbState))}
                deleteItem={deleteData}
                existingIds={listIds(gameDesign.verbs)}
                data={cloneData(verbState)}
                originalId={props.data?.id}
                reset={() => { setVerbState(initialData) }}
                options={options}
            />

            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <fieldset style={{ maxWidth: '25rem' }}>
                    <SchemaForm
                        data={verbState}
                        schema={VerbSchema}
                        changeValue={(value, field) => { handleUpdate(value, field) }}
                    />
                </fieldset>
                <fieldset>
                    <table>
                        <caption>wildcards</caption>
                        <tbody>
                            {Object.entries(wildCard).map(([key, value]) => (
                                <tr key={key}>
                                    <th>{key}</th>
                                    <td>{value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </fieldset>
            </div>

            <fieldset style={{ position: 'relative', maxWidth: '100%' }}>
                <legend>Samples</legend>
                <div>COMMAND: <b>{describeCommand(testCommand, true)}</b></div>
                <ul>
                    <li>DEFAULT(reachable): {getDefaultResponseText(testCommand, false)}</li>
                    <li>DEFAULT(unreachable):{getDefaultResponseText(testCommand, true)}</li>
                </ul>

                {!!verbState.preposition && <>
                    <div>COMMAND: <b>{describeCommand(testCommandWithItem, true)}</b></div>
                    <ul>
                        <li>DEFAULT(reachable): {getDefaultResponseText(testCommandWithItem, false)}</li>
                        <li>DEFAULT(unreachable): {getDefaultResponseText(testCommandWithItem, true)}</li>
                    </ul>
                </>}
            </fieldset>
        </article>
    )
}
