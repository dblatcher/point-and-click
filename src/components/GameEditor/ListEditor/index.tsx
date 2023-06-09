import { Component, ReactNode, Fragment } from "react";
import { Box, Paper, Stack, Button, ButtonGroup, StackProps } from "@mui/material";
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import ArrowCircleUp from "@mui/icons-material/ArrowCircleUp"
import ArrowCircleDown from "@mui/icons-material/ArrowCircleDown"
import { redTheme } from "@/theme";


interface Props<T> {
    list: T[];
    describeItem: { (item: T, index: number): ReactNode };
    mutateList: { (newList: T[]): void };
    createItem?: { (): T | undefined };
    createButton?: 'END';
    noMoveButtons?: boolean;
    noDeleteButtons?: boolean;
    darkItembackground?: boolean;
    insertText?: string;
    deleteText?: string;
    stackSx?: StackProps['sx'];
    tight?: boolean;
}


export class ListEditor<T> extends Component<Props<T>> {

    handleDelete(index: number) {
        const { list, mutateList } = this.props
        const listCopy = [...list]
        listCopy.splice(index, 1)
        mutateList(listCopy)
    }

    handleInsert(index: number) {
        const { list, mutateList, createItem } = this.props
        if (!createItem) { return }
        const listCopy = [...list]
        const newItem = createItem()
        if (!newItem) { return }
        listCopy.splice(index, 0, newItem)
        mutateList(listCopy)
    }

    handleMove(index: number, direction: 'UP' | 'DOWN') {
        const { list, mutateList } = this.props
        const reinsertIndex = direction === 'UP' ? index - 1 : index + 1
        if (reinsertIndex < 0 || reinsertIndex >= list.length) { return }
        const listCopy = [...list]
        const [itemToMove] = listCopy.splice(index, 1)


        listCopy.splice(reinsertIndex, 0, itemToMove)
        mutateList(listCopy)
    }

    renderButton(role: 'UP' | 'DOWN' | 'INSERT' | 'DELETE', index: number, fullWidthInsert = false) {
        const { insertText, deleteText } = this.props
        switch (role) {
            case 'DELETE': return (
                <Button size='small'
                    color={'error'}
                    onClick={() => { this.handleDelete(index) }}
                    startIcon={<DeleteIcon />}
                >{deleteText}
                </Button>
            )
            case 'INSERT': return (
                <Button size='small'
                    fullWidth={fullWidthInsert}
                    variant={fullWidthInsert ? 'outlined' : 'text'}
                    color={'success'}
                    onClick={() => { this.handleInsert(index) }}
                    startIcon={<AddIcon />}
                >{insertText}
                </Button>
            )
            case 'UP':
            case 'DOWN': return (
                <Button size='small'
                    color={'info'}
                    onClick={() => { this.handleMove(index, role) }}
                    startIcon={role === 'UP' ? <ArrowCircleUp /> : <ArrowCircleDown />}
                />
            )
        }
    }

    render() {
        const {
            list, describeItem, createItem, createButton, noMoveButtons, darkItembackground = false, noDeleteButtons,
            stackSx = {}, tight = false,
        } = this.props


        if (tight) {
            return (
                <Stack component={'ul'} sx={{ margin: 0, padding: 0, listStyle: 'none', ...stackSx }}>
                    {list.map((item, index) => (
                        <Fragment key={index}>
                            {(!!createItem && createButton !== 'END') && (
                                <Box component={'li'}>
                                    {this.renderButton('INSERT', index, true)}
                                </Box>
                            )}
                            <Stack component={'li'} direction={'row'} alignItems={'center'} justifyContent={'space-between'} spacing={1} paddingBottom={1}>
                                {describeItem(item, index)}
                                <ButtonGroup>
                                    {!noMoveButtons && <>
                                        {this.renderButton('UP', index)}
                                        {this.renderButton('DOWN', index)}
                                    </>}
                                    {!noDeleteButtons && <>
                                        {this.renderButton('DELETE', index)}
                                    </>}
                                </ButtonGroup>
                            </Stack>
                        </Fragment>
                    ))}
                    {!!createItem && (
                        <Box component={'li'}>
                            {this.renderButton('INSERT', list.length, true)}
                        </Box>
                    )}
                </Stack>
            )
        }

        const theme = redTheme
        const paperStyle = {
            backgroundColor: darkItembackground ? theme.palette.grey[200] : undefined
        }

        return (
            <Stack component={'ul'} sx={{ margin: 0, padding: 0, listStyle: 'none', ...stackSx }} spacing={1}>
                {list.map((item, index) => (
                    <Fragment key={index}>
                        {(!!createItem && createButton !== 'END') && (
                            <Box component={'li'}>
                                {this.renderButton('INSERT', index, true)}
                            </Box>
                        )}
                        <Paper component={'li'} sx={paperStyle}>
                            <Stack direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'} spacing={1} padding={1}>
                                {describeItem(item, index)}
                                <ButtonGroup>
                                    {!noMoveButtons && <>
                                        {this.renderButton('UP', index)}
                                        {this.renderButton('DOWN', index)}
                                    </>}
                                    {!noDeleteButtons && <>
                                        {this.renderButton('DELETE', index)}
                                    </>}
                                </ButtonGroup>
                            </Stack>
                        </Paper>
                    </Fragment>
                ))}
                {!!createItem && (
                    <Box component={'li'}>
                        {this.renderButton('INSERT', list.length, true)}
                    </Box>
                )}
            </Stack>
        )
    }
}