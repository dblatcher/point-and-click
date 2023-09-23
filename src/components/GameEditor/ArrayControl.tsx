import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, ButtonGroup, IconButton, Stack } from "@mui/material";
import { Fragment, ReactNode } from "react";


type Color = "success" | "primary" | "secondary" | "error" | "info" | "warning"

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
    color?: Color
}


const MoveButton = ({ role, index, handleMove, color }: {
    role: 'UP' | 'DOWN'
    index: number;
    handleMove: { (index: number, role: 'UP' | 'DOWN'): void }
    color?: Color
}) => (
    <Button size='small'
        title={role}
        color={color}
        onClick={() => { handleMove(index, role) }}
    >{role === 'UP' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}</Button>
)
const InsertButton = ({ index, handleInsert, color }: {
    index: number;
    handleInsert: { (index: number): void }
    color?: Color
}) => (

    <Box width={'100%'} height={0} component={'aside'}>
        <Box position={'relative'} display={"flex"} justifyContent={'flex-end'} sx={{ transform: 'translateY(-50%)' }}>
            <IconButton size="large"
                title="insert"
                color={color}
                onClick={() => { handleInsert(index) }}
            >
                <AddIcon />
            </IconButton>
        </Box>
    </Box>
)
const DeleteButton = ({ index, handleDelete, color }: {
    index: number;
    handleDelete: { (index: number): void }
    color?: Color
}) => (
    <IconButton size='large'
        color={color}
        onClick={() => { handleDelete(index) }}
        title="delete"
    ><DeleteIcon />
    </IconButton>
)

export const ArrayControl = <T,>(props: Props<T>) => {

    const {
        list, describeItem, createItem, createButton, noMoveButtons, noDeleteButtons,
        color = 'primary'
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
        <Stack sx={{ paddingY: 2 }}>
            {list.map((item, index) => (
                <Fragment key={index}>
                    {(!!createItem && createButton !== 'END') && (
                        <InsertButton index={index} handleInsert={handleInsert} color={color} />
                    )}
                    <Stack component={'article'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        direction={'row'}
                        spacing={1} paddingBottom={1}
                        minHeight={72}
                    >
                        {!noMoveButtons && (
                            <ButtonGroup orientation="vertical" component={'aside'}>
                                <MoveButton handleMove={handleMove} index={index} role="UP" color={color} />
                                <MoveButton handleMove={handleMove} index={index} role="DOWN" color={color} />
                            </ButtonGroup>
                        )}

                        <Box flex={1}>
                            {describeItem(item, index)}
                        </Box>

                        {!noDeleteButtons && (
                            <Box position={'relative'} component={'aside'}>
                                <DeleteButton index={index} handleDelete={handleDelete} color={color} />
                            </Box>
                        )}

                    </Stack>
                </Fragment>
            ))}
            {
                !!createItem && (
                    <InsertButton index={list.length} handleInsert={handleInsert} color={color} />
                )
            }
        </Stack >
    )

}
