import { Box, ButtonGroup, IconButton, Paper, Stack, StackProps } from "@mui/material";
import { Fragment, ReactNode } from "react";
import { AddIcon, ArrowUpwardIcon, ArrowLeftIcon, ArrowRightIcon, ArrowDownwardIcon, DeleteIcon, ClearIcon } from "./material-icons";


type Color = "success" | "primary" | "secondary" | "error" | "info" | "warning"
type Framing = 'PLAIN' | 'NONE'
type ButtonSize = "small" | "medium" | "large"

interface Props<T> {
    list: T[];
    describeItem: { (item: T, index: number): ReactNode };
    mutateList: { (newList: T[]): void };
    createItem?: { (): T | undefined };
    customCreateButton?: { (index: number): ReactNode }
    customInsertFunction?: { (index: number): void };
    createButtonPlacement?: 'END';
    noMoveButtons?: boolean;
    noDeleteButtons?: boolean;
    insertText?: string;
    deleteText?: string;
    color?: Color
    frame?: Framing
    buttonSize?: ButtonSize
    horizontalMoveButtons?: boolean
    stackProps?: StackProps;
    deleteIcon?: 'delete' | 'clear';
    format?: 'stack' | 'cards';
}

type FormatProps<T> = Props<T> & {
    handleInsert?: {
        (index: number): void;
    };
    handleMove: {
        (index: number, role: "UP" | "DOWN"): void;
    };
    handleDelete: {
        (index: number): void;
    };
}

const MoveButton = ({ role, index, handleMove, color, horizontal }: {
    role: 'UP' | 'DOWN'
    index: number;
    handleMove: { (index: number, role: 'UP' | 'DOWN'): void }
    color?: Color
    horizontal?: boolean
}) => {
    const ArrowIcon = horizontal
        ? (role === 'UP' ? ArrowLeftIcon : ArrowRightIcon)
        : (role === 'UP' ? ArrowUpwardIcon : ArrowDownwardIcon);
    return (
        <IconButton size='small'
            title={role}
            color={color}
            onClick={() => { handleMove(index, role) }}
        ><ArrowIcon /></IconButton>
    )
}
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
const DeleteButton = ({ index, handleDelete, color, buttonSize, deleteIcon }: {
    index: number;
    handleDelete: { (index: number): void }
    color?: Color
    buttonSize?: ButtonSize
    deleteIcon: 'delete' | 'clear'
}) => (
    <IconButton size={buttonSize}
        color={color}
        onClick={() => { handleDelete(index) }}
        title="delete"
    >
        {deleteIcon === 'delete' && <DeleteIcon />}
        {deleteIcon === 'clear' && <ClearIcon />}
    </IconButton>
)


const Frame = (props: { children: ReactNode, index: number, framing: Framing }) => {
    const { framing } = props

    if (framing === 'NONE') {
        return <>{props.children}</>
    }

    return <Paper
        sx={{ padding: 1, marginY: 4 }}
        elevation={2}>
        {props.children}
    </Paper>
}

const CardsFormat = <T,>({
    list, describeItem, createButtonPlacement: createButton, noMoveButtons, noDeleteButtons,
    color = 'primary',
    buttonSize = 'large',
    horizontalMoveButtons = true,
    deleteIcon = 'delete',
    handleInsert,
    handleMove,
    handleDelete,
}: FormatProps<T>) => {

    return <Box display={'flex'} gap={2} flexWrap={'wrap'}>
        {list.map((item, index) => (
            <Fragment key={index}>
                {(!!handleInsert && createButton !== 'END') && (
                    <IconButton size={buttonSize}
                        title="insert"
                        color={color}
                        onClick={() => { handleInsert(index) }}
                    >
                        <AddIcon />
                    </IconButton>
                )}

                <Box display={'flex'} flexDirection={'column'}>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                        {!noMoveButtons && (
                            <ButtonGroup orientation={horizontalMoveButtons ? 'horizontal' : 'vertical'} component={'aside'}>
                                <MoveButton horizontal handleMove={handleMove} index={index} role="UP" color={color} />
                                <MoveButton horizontal handleMove={handleMove} index={index} role="DOWN" color={color} />
                            </ButtonGroup>
                        )}
                        {!noDeleteButtons &&
                            <DeleteButton handleDelete={handleDelete} index={index} deleteIcon={deleteIcon} color={color} />
                        }
                    </Stack>
                    <Box>
                        {describeItem(item, index)}
                    </Box>
                </Box>
            </Fragment>
        ))}

        {
            !!handleInsert && (
                <IconButton size={buttonSize}
                    title="insert"
                    color={color}
                    onClick={() => { handleInsert(list.length) }}
                >
                    <AddIcon />
                </IconButton>
            )
        }
    </Box>
}

const StackFormat = <T,>({
    list, describeItem, createButtonPlacement: createButton, noMoveButtons, noDeleteButtons,
    color = 'primary',
    frame = 'NONE',
    buttonSize = 'large',
    horizontalMoveButtons = false,
    stackProps,
    deleteIcon = 'delete',
    customCreateButton,
    handleInsert,
    handleMove,
    handleDelete,
}: FormatProps<T>) => {

    const renderCreateButton = (index: number): ReactNode => {
        if (customCreateButton) {
            return customCreateButton(index)
        }
        if (handleInsert) {
            return <InsertButton index={index} handleInsert={handleInsert} color={color} buttonSize={buttonSize} />
        }
        return null
    }

    return (
        <Stack sx={{ paddingY: noMoveButtons ? 1 : 2 }} {...stackProps}>
            {list.map((item, index) => (
                <Fragment key={index}>
                    {(createButton !== 'END') && renderCreateButton(index)}
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
                                    <DeleteButton index={index}
                                        handleDelete={handleDelete}
                                        color={color}
                                        buttonSize={buttonSize}
                                        deleteIcon={deleteIcon} />
                                </Box>
                            )}

                        </Stack>
                    </Frame>
                </Fragment>
            ))}
            {
                renderCreateButton(list.length)
            }
        </Stack >
    )
}

export const ArrayControl = <T,>({
    list, describeItem, createItem, createButtonPlacement, noMoveButtons, noDeleteButtons,
    mutateList,
    customCreateButton,
    color = 'primary',
    frame = 'NONE',
    buttonSize = 'large',
    horizontalMoveButtons,
    stackProps,
    deleteIcon = 'delete',
    format = 'stack',
    customInsertFunction,
}: Props<T>) => {

    const handleDelete = (index: number) => {
        const listCopy = [...list]
        listCopy.splice(index, 1)
        mutateList(listCopy)
    }

    const handleInsert = customInsertFunction
        ? customInsertFunction
        : createItem
            ? (index: number) => {
                if (!createItem) { return }
                const listCopy = [...list]
                const newItem = createItem()
                if (typeof newItem === 'undefined') { return }
                listCopy.splice(index, 0, newItem)
                mutateList(listCopy)
            }
            : undefined

    const handleMove = (index: number, direction: 'UP' | 'DOWN') => {
        const reinsertIndex = direction === 'UP' ? index - 1 : index + 1
        if (reinsertIndex < 0 || reinsertIndex >= list.length) { return }
        const listCopy = [...list]
        const [itemToMove] = listCopy.splice(index, 1)
        listCopy.splice(reinsertIndex, 0, itemToMove)
        mutateList(listCopy)
    }

    const formatProps = {
        list, describeItem, createItem, createButton: createButtonPlacement, noMoveButtons, noDeleteButtons,
        mutateList,
        color,
        frame,
        buttonSize,
        horizontalMoveButtons,
        stackProps,
        deleteIcon,
        format,
        handleDelete,
        handleMove,
        handleInsert,
        customCreateButton,
    }

    if (format === 'cards') {
        return <CardsFormat {...formatProps} />
    }

    return <StackFormat {...formatProps} />

}
