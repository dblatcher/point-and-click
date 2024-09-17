
import { useGameDesign } from "@/context/game-design-context";
import { Flag, FlagMap } from "@/definitions/Flag";
import { Box, FormControlLabel, Paper, Switch, Typography } from "@mui/material";
import { StringInput } from "../SchemaForm/StringInput";
import { RecordEditor } from "./RecordEditor";
import { makeNewFlag } from "./defaults";
import { FlagCircleIcon } from "./material-icons";

const FlagCard = ({ id, flag }: { id: string, flag: Flag }) => {
    const { gameDesign, performUpdate } = useGameDesign()
    const toggleValue = () => {
        performUpdate('flagMap', {
            ...gameDesign.flagMap,
            [id]: { ...flag, value: !flag.value, default: !flag.value }
        })
    }
    const setDescription = (description: string) => {
        performUpdate('flagMap', {
            ...gameDesign.flagMap,
            [id]: { ...flag, description }
        })
    }

    return (
        <Box component={Paper} padding={2} minWidth={250}>
            <Box padding={2} display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={2}>
                <FlagCircleIcon color="primary" fontSize="large" />
                <Typography>{id}</Typography>
                <FormControlLabel
                    style={{
                        margin: 0
                    }}
                    label={`starts: ${flag.value ? 'on' : 'off'}`}
                    labelPlacement="top"
                    control={<Switch
                        size="small"
                        checked={flag.value}
                        onChange={toggleValue}
                        color="primary" />}
                />
            </Box>
            <StringInput label="description" value={flag.description ?? ''} inputHandler={setDescription} />
        </Box >
    )
}

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
        record={gameDesign.flagMap}
        containerProps={{
            alignItems: 'center',
            marginBottom: 10,
        }}
        addEntryLabel="add new flag"
        describeValue={(key, flag) => {
            return <FlagCard id={key} flag={flag} />
        }}
        addEntry={addEntry}
        setEntry={setEntry}
    />
};
