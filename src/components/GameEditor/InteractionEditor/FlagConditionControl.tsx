import { useGameDesign } from "@/context/game-design-context";
import { Interaction } from "point-click-lib";
import { Divider, Stack } from "@mui/material";
import React from "react";
import { EditorBox } from "../layout/EditorBox";
import { HelpButton } from "../HelpButton";
import { MultipleSelectChip } from "../MultipleSelectChip";
import { NewFlagButton } from "../NewFlagButton";


interface Props {
    interaction: Partial<Interaction>
    updateInteraction: { (mod: Partial<Interaction>, description: string): void }
}


export const FlagConditionControl: React.FunctionComponent<Props> = ({ interaction, updateInteraction }) => {
    const { gameDesign } = useGameDesign()
    const { flagMap } = gameDesign;
    const { flagsThatMustBeFalse = [], flagsThatMustBeTrue = [] } = interaction

    return <EditorBox title="Required Flags" barContent={(
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <NewFlagButton />
            <HelpButton helpTopic="flag-conditions" />
        </div>
    )}>
        <Stack divider={<Divider />}>
            <MultipleSelectChip
                label="Must be on"
                options={Object.keys(flagMap).filter(id => !flagsThatMustBeFalse.includes(id)).map(id => ({ id, description: flagMap[id]?.description }))}
                selectedOptionIds={flagsThatMustBeTrue}
                setSelectedOptionIds={flagsThatMustBeTrue => updateInteraction(
                    { flagsThatMustBeTrue },
                    `flags ${flagsThatMustBeTrue.join()} must be on`
                )}
                idBase="flags-must-be-on"
            />
            <MultipleSelectChip
                label="Must be off"
                options={Object.keys(flagMap).filter(id => !flagsThatMustBeTrue.includes(id)).map(id => ({ id, description: flagMap[id]?.description }))}
                selectedOptionIds={flagsThatMustBeFalse}
                setSelectedOptionIds={flagsThatMustBeFalse => updateInteraction(
                    { flagsThatMustBeFalse },
                    `flags ${flagsThatMustBeFalse.join()} must be off`
                )}
                idBase="flags-must-be-off"
            />
        </Stack>
    </EditorBox>
}