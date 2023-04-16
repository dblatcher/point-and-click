import { Dialog, DialogTitle, DialogContent, IconButton, Tooltip, Switch, FormGroup, FormControlLabel, Typography } from '@mui/material'
import { CheckBoxInput } from './formControls'
import { EditorOptions } from '.'
import { useState } from 'react'
import Settings from '@mui/icons-material/Settings'

interface Props {
    options: EditorOptions
    setOptions: { (options: EditorOptions): void }
}

export const OptionsMenu = ({ options, setOptions }: Props) => {
    const [open, setOpen] = useState(false)


    return (
        <>
            <Tooltip title='options'>
                <IconButton onClick={() => { setOpen(true) }}><Settings /></IconButton>
            </Tooltip>

            <Dialog open={open} onClose={() => { setOpen(false) }}>
                <DialogTitle>

                    options
                </DialogTitle>

                <DialogContent>
                    <FormGroup>
                        <FormControlLabel control={
                            <Switch checked={options.autoSave} onInput={ev => {
                                setOptions({ ...options, autoSave: !options.autoSave })
                            }} />
                        } label="autosave updates" />
                    </FormGroup>
                </DialogContent>
            </Dialog>
        </>
    )
}