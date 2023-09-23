import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, ButtonGroup, IconButton, Stack } from "@mui/material";
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
}


const MoveButton = ({ role, index, handleMove }: {
    role: 'UP' | 'DOWN'
    index: number;
    handleMove: { (index: number, role: 'UP' | 'DOWN'): void }
}) => (
    <Button size='small'
        title={role}
        color={'info'}
        onClick={() => { handleMove(index, role) }}
    >{role === 'UP' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}</Button>
)
const InsertButton = ({ index, handleInsert, }: {
    index: number;
    handleInsert: { (index: number): void }
}) => (
    <IconButton size="large"
        title="insert"
        color={'success'}
        onClick={() => { handleInsert(index) }}
    ><AddIcon />
    </IconButton>
)
const DeleteButton = ({ index, handleDelete, }: {
    index: number;
    handleDelete: { (index: number): void }
}) => (
    <IconButton size='large'
        color={'warning'}
        onClick={() => { handleDelete(index) }}
        title="delete"
    ><DeleteIcon />
    </IconButton>
)

export const ArrayControl = <T,>(props: Props<T>) => {

    const {
        list, describeItem, createItem, createButton, noMoveButtons, noDeleteButtons,
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


    return (
        <Stack sx={{ paddingRight: 8, paddingY: 4 }}>
            {list.map((item, index) => (
                <Fragment key={index}>
                    {(!!createItem && createButton !== 'END') && (
                        <Box position={'relative'} component={'aside'}>
                            <Box position={'absolute'}
                                sx={{
                                    transform: "translateY(-50%) translateX(100%)",
                                    right: 0
                                }}
                            >
                                <InsertButton index={index} handleInsert={handleInsert} />
                            </Box>
                        </Box>
                    )}
                    <Stack component={'article'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        direction={'row'}
                        spacing={1} paddingBottom={1}
                    >
                        {!noMoveButtons && (
                            <ButtonGroup orientation="vertical">
                                <MoveButton handleMove={handleMove} index={index} role="UP" />
                                <MoveButton handleMove={handleMove} index={index} role="DOWN" />
                            </ButtonGroup>
                        )}
                        {describeItem(item, index)}

                        {!noDeleteButtons && (
                            <Box position={'relative'} component={'aside'}>
                                <Box position={'absolute'}
                                    sx={{
                                        transform: "translateY(-50%) translateX(100%)",
                                        right: 0
                                    }}
                                >
                                    <DeleteButton index={index} handleDelete={handleDelete} />
                                </Box>
                            </Box>
                        )}

                    </Stack>
                </Fragment>
            ))}
            {!!createItem && (
                <Box position={'relative'} component={'aside'}>
                    <Box position={'absolute'}
                        sx={{
                            transform: "translateY(-50%) translateX(100%)",
                            right: 0
                        }}
                    >
                        <InsertButton index={list.length} handleInsert={handleInsert} />
                    </Box>
                </Box>
            )}
        </Stack >
    )

}
