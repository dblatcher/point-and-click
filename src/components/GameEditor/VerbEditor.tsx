
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
import { Box, Stack, Typography } from "@mui/material";
import { EditorBox } from "./EditorBox";
import { StringInput } from "../SchemaForm/StringInput";


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

    const [sampleTargetName, setSampleTargetName] = useState('TARGET')
    const [sampleItemName, setSampleItemName] = useState('ITEM')


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
        verb: { ...verbState, preposition: verbState.preposition || '[WITH]' },
        target: { ...testTarget, name: sampleTargetName },
        item: { ...testItem, name: sampleItemName },
    }
    const testCommand: Command = {
        verb: verbState,
        target: { ...testTarget, name: sampleTargetName },
    }


    return (

        <Stack spacing={2}>
            <EditorHeading heading="Verb Editor" itemId={initialData.id} />
            <Stack direction={'row'} spacing={2}>
                <EditorBox title="Verb config" boxProps={{ flexBasis: 400 }}>
                    <SchemaForm
                        data={verbState}
                        schema={VerbSchema}
                        changeValue={(value, field) => { handleUpdate(value, field) }}
                    />
                </EditorBox>
                <Stack spacing={2}>
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
                    <EditorBox title="wildcards for default responses">
                        <table>
                            <tbody>
                                {Object.entries(wildCard).map(([key, value]) => (
                                    <tr key={key}>
                                        <th>{key}</th>
                                        <td>{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </EditorBox>
                </Stack>
            </Stack>

            <EditorBox title="Default Responses">
                <Stack direction={'row'} spacing={2}>
                    <Box sx={{ flexBasis: 300 }}>
                        <StringInput
                            label="sample target name"
                            value={sampleTargetName}
                            inputHandler={setSampleTargetName}
                            suggestions={['TARGET', 'door', 'statue', 'window', 'hillside', 'axe', 'pair of wax lips', 'banana tree']}
                        />
                        <StringInput
                            label="sample item name"
                            value={sampleItemName}
                            inputHandler={setSampleItemName}
                            suggestions={['ITEM', 'key', 'oily rag', 'pair of scissors', 'ancient artifact']}
                        />
                    </Box>
                    <Box>
                        <Stack direction={'row'} spacing={4}>
                            <Typography fontWeight={700}>{describeCommand(testCommand, true)} (reachable)</Typography>
                            <Typography variant="overline" component={'q'}>{getDefaultResponseText(testCommand, false)}</Typography>
                        </Stack>
                        <Stack direction={'row'} spacing={4}>
                            <Typography fontWeight={700}>{describeCommand(testCommand, true)} (unreachable)</Typography>
                            <Typography variant="overline" component={'q'}>{getDefaultResponseText(testCommand, true)}</Typography>
                        </Stack>
                        <Stack direction={'row'} spacing={4}>
                            <Typography fontWeight={700}>{describeCommand(testCommandWithItem, true)} (reachable)</Typography>
                            <Typography variant="overline" component={'q'}>{getDefaultResponseText(testCommandWithItem, false)}</Typography>
                        </Stack>
                        <Stack direction={'row'} spacing={4}>
                            <Typography fontWeight={700}>{describeCommand(testCommandWithItem, true)} (unreachable)</Typography>
                            <Typography variant="overline" component={'q'}>{getDefaultResponseText(testCommandWithItem, true)}</Typography>
                        </Stack>
                    </Box>
                </Stack>
            </EditorBox>


        </Stack>
    )
}
