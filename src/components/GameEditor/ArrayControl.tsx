import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, ButtonGroup, IconButton, Paper, Stack } from "@mui/material";
import { Fragment, ReactNode } from "react";


type Color = "success" | "primary" | "secondary" | "error" | "info" | "warning"
type Framing = 'PLAIN' | 'NONE'
type ButtonSize = "small" | "medium" | "large"

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
    frame?: Framing
    buttonSize?: ButtonSize
    horizontalMoveButtons?: boolean
}


const MoveButton = ({ role, index, handleMove, color }: {
    role: 'UP' | 'DOWN'
    index: number;
    handleMove: { (index: number, role: 'UP' | 'DOWN'): void }
    color?: Color
}) => (
    <IconButton size='small'
        title={role}
        color={color}
        onClick={() => { handleMove(index, role) }}
    >{role === 'UP' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}</IconButton>
)
const InsertButton = ({ index, handleInsert, color, buttonSize }: {
    index: number;
    handleInsert: { (index: number): void }
    color?: Color
    buttonSize?: ButtonSize
}) => (

    <Box width={'100%'} height={0} component={'aside'}>
        <Box position={'relative'} display={"flex"} justifyContent={'flex-end'} sx={{ transform: 'translateY(-50%)' }}>
            <IconButton size={buttonSize}
                title="insert"
                color={color}
                onClick={() => { handleInsert(index) }}
            >
                <AddIcon />
            </IconButton>
        </Box>
    </Box>
)
const DeleteButton = ({ index, handleDelete, color, buttonSize }: {
    index: number;
    handleDelete: { (index: number): void }
    color?: Color
    buttonSize?: ButtonSize
}) => (
    <IconButton size={buttonSize}
        color={color}
        onClick={() => { handleDelete(index) }}
        title="delete"
    ><DeleteIcon />
    </IconButton>
)


const Frame = (props: { children: ReactNode, index: number, framing: Framing }) => {
    const { framing } = props

    if (framing === 'NONE') {
        return <>{props.children}</>
    }

    return <Paper
        sx={{ padding: 1, marginY: 1.5 }}
        elevation={2}>
        {props.children}
    </Paper>
}

export const ArrayControl = <T,>({
    list, describeItem, createItem, createButton, noMoveButtons, noDeleteButtons,
    mutateList,
    color = 'primary',
    frame = 'NONE',
    buttonSize = 'large',
    horizontalMoveButtons = false,
}: Props<T>) => {


    const handleDelete = (index: number) => {
        const listCopy = [...list]
        listCopy.splice(index, 1)
        mutateList(listCopy)
    }


    const handleInsert = (index: number) => {
        if (!createItem) { return }
        const listCopy = [...list]
        const newItem = createItem()
        if (!newItem) { return }
        listCopy.splice(index, 0, newItem)
        mutateList(listCopy)
    }

    const handleMove = (index: number, direction: 'UP' | 'DOWN') => {
        const reinsertIndex = direction === 'UP' ? index - 1 : index + 1
        if (reinsertIndex < 0 || reinsertIndex >= list.length) { return }
        const listCopy = [...list]
        const [itemToMove] = listCopy.splice(index, 1)
        listCopy.splice(reinsertIndex, 0, itemToMove)
        mutateList(listCopy)
    }

    return (
        <Stack sx={{ paddingY: noMoveButtons ? 1 : 2 }}>
            {list.map((item, index) => (
                <Fragment key={index}>
                    {(!!createItem && createButton !== 'END') && (
                        <InsertButton index={index} handleInsert={handleInsert} color={color} buttonSize={buttonSize} />
                    )}
                    <Frame index={index} framing={frame}>
                        <Stack component={'article'}
                            justifyContent={'space-between'}
                            alignItems={'center'}
                            direction={'row'}
                            spacing={1}
                        >
                            {!noMoveButtons && (
                                <ButtonGroup orientation={horizontalMoveButtons ? 'horizontal' : 'vertical'} component={'aside'}>
                                    <MoveButton handleMove={handleMove} index={index} role="UP" color={color} />
                                    <MoveButton handleMove={handleMove} index={index} role="DOWN" color={color} />
                                </ButtonGroup>
                            )}

                            <Box flex={1}>
                                {describeItem(item, index)}
                            </Box>

                            {!noDeleteButtons && (
                                <Box position={'relative'} component={'aside'}>
                                    <DeleteButton index={index} handleDelete={handleDelete} color={color} buttonSize={buttonSize} />
                                </Box>
                            )}

                        </Stack>
                    </Frame>
                </Fragment>
            ))}
            {
                !!createItem && (
                    <InsertButton index={list.length} handleInsert={handleInsert} color={color} buttonSize={buttonSize} />
                )
            }
        </Stack >
    )

}
