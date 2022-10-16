/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h, Fragment } from "preact";
import { Flag, FlagMap, FlagSchema } from "../../definitions/Flag";
import { GameDesign } from "../../definitions/Game";
import { makeNewFlag } from "./defaults";
import { RecordEditor } from "./RecordEditor";
import { getModification, SchemaForm } from "./SchemaForm";

interface Props {
    gameDesign: GameDesign;
    edit: { (property: keyof GameDesign, value: unknown): void };
}

export const FlagMapControl: FunctionalComponent<Props> = ({
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

    return <RecordEditor
        record={gameDesign.flagMap}
        describeValue={(key, flag) => {
            return <>
                <b style={{
                    marginLeft: '.5em',
                    marginRight: 'auto',
                }}>{key}</b>
                <SchemaForm key={key}
                    schema={FlagSchema}
                    data={flag}
                    changeValue={(value, fieldDef) => {
                        return setEntry(key, Object.assign({}, flag, getModification(value, fieldDef)))
                    }}
                />
            </>
        }}
        addEntry={addEntry}
        setEntry={setEntry}
    />;
};
