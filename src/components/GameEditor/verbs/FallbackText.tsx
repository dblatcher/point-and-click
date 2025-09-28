import { StringInput } from "@/components/SchemaForm/StringInput"
import { Command, CommandTarget, ItemData, Verb } from "@/definitions"
import { describeCommand, getDefaultResponseText } from "@/lib/commandFunctions"
import { BoxProps, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"
import { useState } from "react"
import { EditorBox } from "../layout/EditorBox"

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

const targetSuggestions = ['TARGET', 'door', 'statue', 'window', 'hillside', 'axe', 'pair of wax lips', 'banana tree'];
const itemSuggestions = ['ITEM', 'key', 'oily rag', 'pair of scissors', 'ancient artifact'];

const previewBoxStyle: BoxProps = { display: 'flex', flexDirection: 'column' }


export const FallbackText = ({ verb }: { verb: Verb }) => {

    const [dialogOpen, setDialogOpen] = useState(false)
    const [sampleTargetName, setSampleTargetName] = useState(targetSuggestions[0])
    const [sampleItemName, setSampleItemName] = useState(itemSuggestions[0])

    const testCommandWithItem: Command = {
        verb,
        target: { ...testTarget, name: sampleTargetName },
        item: { ...testItem, name: sampleItemName },
    }
    const testCommand: Command = {
        verb,
        target: { ...testTarget, name: sampleTargetName },
    }

    return (
        <>
            <Button variant="outlined" color="secondary" onClick={() => setDialogOpen(true)}>Test default responses</Button>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Test default responses:{verb.label ?? verb.id}</DialogTitle>
                <DialogContent sx={{ minWidth: 300 }}>
                    <EditorBox themePalette="secondary">
                        <StringInput
                            label="sample target name"
                            value={sampleTargetName}
                            inputHandler={setSampleTargetName}
                            suggestions={targetSuggestions}
                        />
                        <StringInput
                            label="sample item name"
                            value={sampleItemName}
                            inputHandler={setSampleItemName}
                            suggestions={itemSuggestions}
                        />
                    </EditorBox>
                    <EditorBox themePalette="secondary" title={describeCommand(testCommand, true).toUpperCase()} contentBoxProps={previewBoxStyle}>
                        <Typography variant="overline">reachable:</Typography>
                        <Typography component={'q'}>{getDefaultResponseText(testCommand, false)}</Typography>
                        <Typography variant="overline">unreachable:</Typography>
                        <Typography component={'q'}>{getDefaultResponseText(testCommand, true)}</Typography>
                    </EditorBox>
                    {verb.preposition && (
                        <EditorBox themePalette="secondary" title={describeCommand(testCommandWithItem, true).toUpperCase()} contentBoxProps={previewBoxStyle}>
                            <Typography variant="overline">reachable:</Typography>
                            <Typography component={'q'}>{getDefaultResponseText(testCommandWithItem, false)}</Typography>
                            <Typography variant="overline">unreachable:</Typography>
                            <Typography component={'q'}>{getDefaultResponseText(testCommandWithItem, true)}</Typography>
                        </EditorBox>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setDialogOpen(false) }}>close</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}