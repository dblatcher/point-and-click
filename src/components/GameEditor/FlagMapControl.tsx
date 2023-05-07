
import { FunctionComponent } from "react";
import { Flag, FlagMap, FlagSchema } from "@/definitions/Flag";
import { GameDesign } from "@/definitions/Game";
import { makeNewFlag } from "./defaults";
import { RecordEditor } from "./RecordEditor";
import { getModification, SchemaForm } from "@/components/SchemaForm";

interface Props {
    gameDesign: GameDesign;
    edit: { (property: keyof GameDesign, value: unknown): void };
}

export const FlagMapControl: FunctionComponent<Props> = ({
    gameDesign,
    edit,
}: Props) => {

    const addEntry = (key: string) => {
        const mod: Partial<FlagMap> = {}
        mod[key] = makeNewFlag()
        return edit('flagMap', Object.assign({}, gameDesign.flagMap, mod))
    }

    const setEntry = (key: string, value: Flag | undefined) => {
        const mod: Partial<FlagMap> = {}
        mod[key] = value
        return edit('flagMap', Object.assign({}, gameDesign.flagMap, mod))
    }

    return <section style={{ maxWidth: '35em' }}>
        <RecordEditor
            record={gameDesign.flagMap}
            describeValue={(key, flag) => {
                return <SchemaForm key={key}
                    formLegend={key}
                    schema={FlagSchema}
                    data={flag}
                    changeValue={(value, fieldDef) => {
                        return setEntry(key, Object.assign({}, flag, getModification(value, fieldDef)))
                    }}
                    containerProps={{
                        flex: 1,
                        spacing: 0,
                        sx: {
                            borderColor: 'primary.light',
                            borderWidth: 1,
                            borderStyle: 'solid'
                        }
                    }}
                    legendProps={{
                        variant:'caption',
                        sx: {
                            padding: 1,
                            backgroundColor: 'primary.light',
                            color: 'primary.contrastText',
                        }
                    }}
                    fieldWrapperProps={{
                        sx: {
                            padding: 1
                        }
                    }}
                />
            }}
            addEntry={addEntry}
            setEntry={setEntry}
        />
    </section>;
};
