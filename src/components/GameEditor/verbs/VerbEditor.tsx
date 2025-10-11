
import { FieldDef, FieldValue, SchemaForm, getModification } from "@/components/SchemaForm";
import { useGameDesign } from "@/context/game-design-context";
import { Verb } from "@/definitions";
import { VerbSchema } from "@/definitions/Verb";
import { wildCard } from "@/lib/commandFunctions";
import { patchMember } from "@/lib/update-design";
import { Alert, Box, Stack } from "@mui/material";
import { useState } from "react";
import { DelayedStringInput } from "../DelayedStringInput";
import { HelpButton } from "../HelpButton";
import { EditorBox } from "../layout/EditorBox";
import { FallbackText } from "./FallbackText";

type Props = {
    verb: Verb,
}

export const VerbEditor = ({ verb }: Props) => {
    const { applyModification, gameDesign } = useGameDesign()

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

    return (
        <Stack spacing={2}>
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
                        isNotForItems: 'cannot target items',
                        requiresItem: 'must have an item',
                        isMoveVerb: 'is "move" verb',
                        isLookVerb: 'is "look" verb',
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

                <Box display={'flex'} alignItems={'center'} justifyContent={'space-around'} flexWrap={'wrap'}>
                    <Alert severity='info' sx={{ flexBasis: 400 }}>
                        Use "{wildCard.VERB}", "{wildCard.TARGET}" and "{wildCard.ITEM}" in the templates and they will be replaced by the corresponding name
                    </Alert>
                    <FallbackText verb={{
                        ...verb,
                        defaultResponseCannotReach: localDefaultResponseCannotReach,
                        defaultResponseNoItem: localDefaultResponseNoItem,
                        defaultResponseWithItem: localDefaultResponseWithItem,
                    }} />
                </Box>
            </EditorBox>
        </Stack>
    )
}
