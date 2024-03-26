
import { SchemaForm, getModification } from "@/components/SchemaForm";
import { Flag, FlagMap, FlagSchema } from "@/definitions/Flag";
import { RecordEditor } from "./RecordEditor";
import { makeNewFlag } from "./defaults";
import { useGameDesign } from "@/context/game-design-context";

export const FlagMapControl = () => {
    const { gameDesign, performUpdate } = useGameDesign()

    const addEntry = (key: string) => {
        const mod: Partial<FlagMap> = {}
        mod[key] = makeNewFlag()
        return performUpdate('flagMap', { ...gameDesign.flagMap, ...mod })
    }

    const setEntry = (key: string, value: Flag | undefined) => {
        const mod: Partial<FlagMap> = {}
        mod[key] = value
        return performUpdate('flagMap', { ...gameDesign.flagMap, ...mod })
    }

    return <RecordEditor
        containerProps={{
            maxWidth: 'sm',
            spacing: 3
        }}
        record={gameDesign.flagMap}
        addEntryLabel="add new flag"
        describeValue={(key, flag) => {
            return <SchemaForm key={key}
                formLegend={key}
                schema={FlagSchema.omit({ 'default': true })}
                data={flag}
                changeValue={(value, fieldDef) => {
                    return setEntry(key, Object.assign({}, flag, getModification(value, fieldDef)))
                }}
                containerProps={{
                    flex: 1,
                    spacing: 0,
                    sx: {
                        borderColor: 'primary.dark',
                        borderWidth: 1,
                        borderStyle: 'solid'
                    }
                }}
                legendProps={{
                    variant: 'caption',
                    sx: {
                        padding: 1,
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText',
                    }
                }}
                fieldWrapperProps={{
                    direction: 'row',
                    spacing: 4,
                    padding: 1,
                }}
            />
        }}
        addEntry={addEntry}
        setEntry={setEntry}
    />

};
