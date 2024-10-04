import { useGameDesign } from "@/context/game-design-context";
import { Interaction } from "@/definitions";
import { Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup, Stack, Switch } from "@mui/material";
import React, { Fragment, useState } from "react";
import { EditorBox } from "../EditorBox";
import { HelpButton } from "../HelpButton";

interface Props {
    interaction: Partial<Interaction>
    updateInteraction: { (mod: Partial<Interaction>): void }
}

const valueToString = (value: boolean | undefined) => typeof value === 'undefined' ? 'any' : value.toString()
const stringToValue = (text: string) => text === 'true' ? true : text === 'false' ? false : undefined

export const FlagConditionControl: React.FunctionComponent<Props> = ({ interaction, updateInteraction }) => {
    const [hideEmpty, setHideEmpty] = useState(false)
    const { gameDesign } = useGameDesign()
    const { flagMap } = gameDesign;
    const { flagsThatMustBeFalse = [], flagsThatMustBeTrue = [] } = interaction

    const flagStateList = Object.entries(flagMap).flatMap(([key, flag]) => {
        if (!flag) { return [] }
        const value = flagsThatMustBeFalse.includes(key) ? false : flagsThatMustBeTrue.includes(key) ? true : undefined
        return { key, flag, value }
    })

    const setValue = (key: string, value: boolean | undefined) => {
        if (!flagMap[key]) {
            return
        }

        let falseList = [...flagsThatMustBeFalse]
        let trueList = [...flagsThatMustBeTrue]

        switch (value) {
            case true:
                falseList = falseList.filter(item => item !== key)
                if (!trueList.includes(key)) {
                    trueList.push(key)
                }
                break
            case false:
                trueList = trueList.filter(item => item !== key)
                if (!falseList.includes(key)) {
                    falseList.push(key)
                }
                break
            case undefined:
                falseList = falseList.filter(item => item !== key)
                trueList = trueList.filter(item => item !== key)
                break
        }

        console.log({
            oldTrue: flagsThatMustBeTrue,
            newTrue: trueList,
            oldFalse: flagsThatMustBeFalse,
            newFalse: flagStateList
        })

        updateInteraction({
            flagsThatMustBeFalse: falseList,
            flagsThatMustBeTrue: trueList,
        })
    }

    return <EditorBox title="Flags" barContent={(
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <FormGroup>
                <FormControlLabel
                    label="hide unset flags"
                    control={
                        <Switch size="small"
                            color="secondary"
                            value={hideEmpty}
                            onChange={(_event, value) => setHideEmpty(value)} />
                    }
                />
            </FormGroup>
            <HelpButton helpTopic="flags" />
        </div>
    )}>
        <Stack divider={<Divider />}>
            {flagStateList.map(flagState => (
                <Fragment key={flagState.key}>
                    {(!hideEmpty || typeof flagState.value === 'boolean') && (
                        <FormControl sx={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingY: 0,
                        }}>
                            <FormLabel sx={{ flex: 1 }}>{flagState.key}</FormLabel>
                            <RadioGroup row
                                aria-label={`${flagState.key}`}
                                name={`flag-group-${flagState.key}`}
                                value={valueToString(flagState.value)}
                                onChange={(_event, value) => {
                                    setValue(flagState.key, stringToValue(value))
                                }} >
                                <FormControlLabel labelPlacement="start" value={'any'} control={<Radio />} label="any" />
                                <FormControlLabel labelPlacement="start" value={'true'} control={<Radio />} label="true" />
                                <FormControlLabel labelPlacement="start" value={'false'} control={<Radio />} label="false" />
                            </RadioGroup>
                        </FormControl>
                    )}
                </Fragment>
            ))}
        </Stack>
    </EditorBox>
}