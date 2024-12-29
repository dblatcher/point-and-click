
import { FieldDef, FieldValue, SchemaForm, getModification } from "@/components/SchemaForm";
import { useGameDesign } from "@/context/game-design-context";
import { Command, CommandTarget, ItemData, Verb } from "@/definitions";
import { VerbSchema } from "@/definitions/Verb";
import { describeCommand, getDefaultResponseText, wildCard } from "@/lib/commandFunctions";
import { Box, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { StringInput } from "../SchemaForm/StringInput";
import { EditorBox } from "./EditorBox";
import { EditorHeading } from "./EditorHeading";
import { ItemEditorHeaderControls } from "./ItemEditorHeaderControls";
import { patchMember } from "@/lib/update-design";


type Props = {
    verb: Verb,
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

export const VerbEditor = ({ verb }: Props) => {
    const { applyModification, gameDesign } = useGameDesign()
    const [sampleTargetName, setSampleTargetName] = useState('TARGET')
    const [sampleItemName, setSampleItemName] = useState('ITEM')

    const handleUpdate = (value: FieldValue, field: FieldDef): void => {
        const property = field.key as keyof Verb;
        const mod = getModification(value, field) as Partial<Verb>
        if (property !== 'id') {
            applyModification(
                `change ${field.key} on verb ${verb.id}`,
                { verbs: patchMember(verb.id, mod, gameDesign.verbs) }
            )
        }
    }

    const testCommandWithItem: Command = {
        verb: { ...verb, preposition: verb.preposition || '[WITH]' },
        target: { ...testTarget, name: sampleTargetName },
        item: { ...testItem, name: sampleItemName },
    }
    const testCommand: Command = {
        verb: verb,
        target: { ...testTarget, name: sampleTargetName },
    }

    // TO DO - move the default responses out of the schema form
    return (
        <Stack spacing={2}>
            <EditorHeading heading="Verb Editor" itemId={verb.id} >
                <ItemEditorHeaderControls
                    dataItem={verb}
                    itemType="verbs"
                    itemTypeName="verb"
                />
            </EditorHeading>
            <Stack direction={'row'} spacing={2}>
                <EditorBox title="Verb config" boxProps={{ flexBasis: 400 }}>
                    <SchemaForm
                        textInputDelay={2000}
                        data={verb}
                        schema={VerbSchema.omit({ id: true })}
                        changeValue={(value, field) => { handleUpdate(value, field) }}
                        fieldAliases={{
                            defaultResponseCannotReach: 'template for default "cannot reach" response',
                            defaultResponseNoItem: 'template for default "doesn\'t work" response',
                            defaultResponseWithItem: 'template for default "doesn\'t work with item" response',        
                        }}
                    />
                </EditorBox>
                <Stack spacing={2} justifyContent={'flex-end'}>
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
