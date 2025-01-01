
import { FieldDef, FieldValue, SchemaForm, getModification } from "@/components/SchemaForm";
import { useGameDesign } from "@/context/game-design-context";
import { Command, CommandTarget, ItemData, Verb } from "@/definitions";
import { VerbSchema } from "@/definitions/Verb";
import { describeCommand, getDefaultResponseText, wildCard } from "@/lib/commandFunctions";
import { patchMember } from "@/lib/update-design";
import { Box, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { StringInput } from "../SchemaForm/StringInput";
import { DelayedStringInput } from "./DelayedStringInput";
import { EditorBox } from "./EditorBox";
import { EditorHeading } from "./EditorHeading";
import { ItemEditorHeaderControls } from "./ItemEditorHeaderControls";
import { HelpButton } from "./HelpButton";


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

    const [localDefaultResponseCannotReach, setLocalDefaultResponseCannotReach] = useState(verb.defaultResponseCannotReach)
    const [localDefaultResponseNoItem, setLocalDefaultResponseNoItem] = useState(verb.defaultResponseNoItem)
    const [localDefaultResponseWithItem, setLocalDefaultResponseWithItem] = useState(verb.defaultResponseWithItem)

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
        verb: {
            ...verb,
            defaultResponseCannotReach: localDefaultResponseCannotReach,
            defaultResponseNoItem: localDefaultResponseNoItem,
            defaultResponseWithItem: localDefaultResponseWithItem,
        },
        target: { ...testTarget, name: sampleTargetName },
        item: { ...testItem, name: sampleItemName },
    }
    const testCommand: Command = {
        verb: {
            ...verb,
            defaultResponseCannotReach: localDefaultResponseCannotReach,
            defaultResponseNoItem: localDefaultResponseNoItem,
            defaultResponseWithItem: localDefaultResponseWithItem,
        },
        target: { ...testTarget, name: sampleTargetName },
    }

    return (
        <Stack spacing={2}>
            <EditorHeading heading="Verb Editor" itemId={verb.id} >
                <ItemEditorHeaderControls
                    dataItem={verb}
                    itemType="verbs"
                    itemTypeName="verb"
                />
            </EditorHeading>
            <EditorBox title="Verb config">
                <SchemaForm
                    textInputDelay={2000}
                    data={verb}
                    schema={VerbSchema.omit({
                        id: true,
                        defaultResponseCannotReach: true,
                        defaultResponseNoItem: true,
                        defaultResponseWithItem: true,
                    })}
                    fieldAliases={{
                        isNotForItems: 'cannot use on inventory',
                        isMoveVerb: 'is "move" verb'
                    }}
                    changeValue={(value, field) => { handleUpdate(value, field) }}
                />
            </EditorBox>


            <EditorBox
                title="Default Responses Templates"
                barContent={<HelpButton helpTopic="default responses" />}
            >
                <DelayedStringInput delayAfterEdits={5000}
                    label='"does not work" response'
                    value={verb.defaultResponseNoItem ?? ''}
                    inputHandler={(defaultResponseNoItem) => {
                        applyModification(
                            `verb ${verb.id}, set defaultResponseNoItem`,
                            { verbs: patchMember(verb.id, { defaultResponseNoItem }, gameDesign.verbs) }
                        )
                    }}
                    reportLocalChange={setLocalDefaultResponseNoItem}
                />
                <DelayedStringInput delayAfterEdits={5000}
                    label='"does not work with item" response'
                    value={verb.defaultResponseWithItem ?? ''}
                    inputHandler={(defaultResponseWithItem) => {
                        applyModification(
                            `verb ${verb.id}, set defaultResponseWithItem`,
                            { verbs: patchMember(verb.id, { defaultResponseWithItem }, gameDesign.verbs) }
                        )
                    }}
                    reportLocalChange={setLocalDefaultResponseWithItem}
                />
                <DelayedStringInput delayAfterEdits={5000}
                    label='"cannot reach" response'
                    value={verb.defaultResponseCannotReach ?? ''}
                    inputHandler={(defaultResponseCannotReach) => {
                        applyModification(
                            `verb ${verb.id}, set defaultResponseCannotReach`,
                            { verbs: patchMember(verb.id, { defaultResponseCannotReach }, gameDesign.verbs) }
                        )
                    }}
                    reportLocalChange={setLocalDefaultResponseCannotReach}
                />
            </EditorBox>

            <Stack>
                <Box display={'flex'} gap={2}>
                    <EditorBox title="wildcards for default responses" themePalette="secondary">
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

                    <EditorBox title="Sample names" boxProps={{ minWidth: 200 }} themePalette="secondary">
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
                    </EditorBox>
                    <Box minWidth={250}>
                        <EditorBox themePalette="secondary" title={describeCommand(testCommand, true).toUpperCase()}>
                            <Stack direction={'row'} spacing={2} alignItems="center">
                                <Typography fontWeight={700}>reachable:</Typography>
                                <Typography variant="overline" component={'q'}>{getDefaultResponseText(testCommand, false)}</Typography>
                            </Stack>
                            <Stack direction={'row'} spacing={4} alignItems="center">
                                <Typography fontWeight={700}>unreachable:</Typography>
                                <Typography variant="overline" component={'q'}>{getDefaultResponseText(testCommand, true)}</Typography>
                            </Stack>
                        </EditorBox>
                        {verb.preposition && (
                            <EditorBox themePalette="secondary" title={describeCommand(testCommandWithItem, true).toUpperCase()}>
                                <Stack direction={'row'} spacing={4} alignItems="center">
                                    <Typography fontWeight={700}>reachable:</Typography>
                                    <Typography variant="overline" component={'q'}>{getDefaultResponseText(testCommandWithItem, false)}</Typography>
                                </Stack>

                                <Stack direction={'row'} spacing={4} alignItems="center">
                                    <Typography fontWeight={700}>unreachable:</Typography>
                                    <Typography variant="overline" component={'q'}>{getDefaultResponseText(testCommandWithItem, true)}</Typography>
                                </Stack>
                            </EditorBox>
                        )}
                    </Box>
                </Box>
            </Stack>

        </Stack>
    )
}
