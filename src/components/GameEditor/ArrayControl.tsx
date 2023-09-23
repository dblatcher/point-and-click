import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, ButtonGroup, Stack, StackProps } from "@mui/material";
import { Fragment, ReactNode } from "react";


interface Props<T> {
    list: T[];
    describeItem: { (item: T, index: number): ReactNode };
    mutateList: { (newList: T[]): void };
    createItem?: { (): T | undefined };
    createButton?: 'END';
    noMoveButtons?: boolean;
    noDeleteButtons?: boolean;
    insertText?: string;
    deleteText?: string;
    stackSx?: StackProps['sx'];
    controlPosition?: 'right' | 'above'
}


const MoveButton = ({ role, index, handleMove }: {
    role: 'UP' | 'DOWN'
    index: number;
    handleMove: { (index: number, role: 'UP' | 'DOWN'): void }
}) => (
    <Button size='small'
        color={'info'}
        onClick={() => { handleMove(index, role) }}
        startIcon={role === 'UP' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
    />
)
const InsertButton = ({ index, handleInsert, }: {
    index: number;
    handleInsert: { (index: number): void }
}) => (
    <Button size='small'
        variant={"outlined"}
        color={'success'}
        onClick={() => { handleInsert(index) }}
        startIcon={<AddIcon />}
    >{'insertText'}
    </Button>
)
const DeleteButton = ({ index, handleDelete, }: {
    index: number;
    handleDelete: { (index: number): void }
}) => (
    <Button size='small'
        variant={"outlined"}
        color={'warning'}
        onClick={() => { handleDelete(index) }}
        startIcon={<DeleteIcon />}
    >{'delete'}
    </Button>
)

export const ArrayControl = <T,>(props: Props<T>) => {



    const {
        list, describeItem, createItem, createButton, noMoveButtons, noDeleteButtons,
        stackSx = {}, controlPosition = 'right'
    } = props


    const handleDelete = (index: number) => {
        const { list, mutateList } = props
        const listCopy = [...list]
        listCopy.splice(index, 1)
        mutateList(listCopy)
    }


    const handleInsert = (index: number) => {
        const { list, mutateList, createItem } = props
        if (!createItem) { return }
        const listCopy = [...list]
        const newItem = createItem()
        if (!newItem) { return }
        listCopy.splice(index, 0, newItem)
        mutateList(listCopy)
    }

    const handleMove = (index: number, direction: 'UP' | 'DOWN') => {
        const { list, mutateList } = props
        const reinsertIndex = direction === 'UP' ? index - 1 : index + 1
        if (reinsertIndex < 0 || reinsertIndex >= list.length) { return }
        const listCopy = [...list]
        const [itemToMove] = listCopy.splice(index, 1)
        listCopy.splice(reinsertIndex, 0, itemToMove)
        mutateList(listCopy)
    }


    const itemStackProps: Partial<StackProps> = controlPosition === 'above' ? {
        direction: 'column-reverse',
        paddingTop: 1,

    } : {
        direction: 'row',
        alignItems: 'center',
    }

    return (
        <Stack component={'ul'} sx={{ margin: 0, padding: 0, listStyle: 'none', ...stackSx }}>
            {list.map((item, index) => (
                <Fragment key={index}>
                    {(!!createItem && createButton !== 'END') && (
                        <Box component={'li'}>
                            <InsertButton index={list.length} handleInsert={handleInsert} />
                        </Box>
                    )}
                    <Stack component={'li'} {...itemStackProps} justifyContent={'space-between'} spacing={1} paddingBottom={1}>
                        {describeItem(item, index)}
                        <ButtonGroup>
                            {!noMoveButtons && <>
                                <MoveButton handleMove={handleMove} index={index} role="UP" />
                                <MoveButton handleMove={handleMove} index={index} role="DOWN" />
                            </>}
                            {!noDeleteButtons && <>
                                <DeleteButton index={index} handleDelete={handleDelete} />
                            </>}
                        </ButtonGroup>
                    </Stack>
                </Fragment>
            ))}
            {!!createItem && (
                <Box component={'li'}>
                    <InsertButton index={list.length} handleInsert={handleInsert} />
                </Box>
            )}
        </Stack>
    )

}
