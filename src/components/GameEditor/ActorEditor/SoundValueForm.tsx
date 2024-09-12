import { FunctionComponent } from "react";
import { SoundValue, SoundValueSchema } from "@/definitions/ActorData";
import soundService from "@/services/soundService";
import { getModification, SchemaForm } from "@/components/SchemaForm";
import { SoundAssetTestButton } from "../SoundAssetTestButton";
import { Box } from "@mui/material";

interface Props {
    animation: string;
    data: SoundValue;
    updateData: { (data: SoundValue): void };
}

export const SoundValueForm: FunctionComponent<Props> = ({ animation, data, updateData }) => {

    return (
        <Box border={1} padding={1} flex={1} position={'relative'}>
            <SchemaForm schema={SoundValueSchema}
                formLegend={`SFX for "${animation}" animation`}
                containerProps={{ flex: 1 }}
                legendProps={{ variant: 'overline', paddingBottom: 2, }}
                options={{ soundId: soundService.list() }}
                fieldAliases={{
                    frameIndex: 'play on frame#:'
                }}
                numberConfig={{ volume: { max: 2, step: .1 } }}
                data={data}
                changeValue={(value, field): void => {
                    return updateData(
                        Object.assign({}, data, getModification(value, field))
                    )
                }}
            />
            <SoundAssetTestButton title={`play sfx ${data.soundId}`} sx={{ position: 'absolute', bottom: 0, right: 0 }} soundAssetId={data.soundId} />
        </Box>
    )
}
