
import { AddIcon } from "@/components/GameEditor/material-icons";
import { SelectInput } from "@/components/SchemaForm/inputs";
import { useGameDesign } from "@/context/game-design-context";
import { Interaction } from "@/definitions";
import { cloneData } from "@/lib/clone";
import { listIds } from "@/lib/util";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import { EditorHeading } from "../EditorHeading";
import { getItemDescriptions, getTargetLists } from "./getTargetLists";
import { InteractionDialog } from "./InteractionDialog";
import { InteractionTableHeaders } from "./InteractionTableHeaders";
import { InteractionTableRow } from "./InteractionTableRow";


interface Props {
    deleteInteraction: { (index: number): void };
    updateInteractionList: { (data: Interaction[]): void };
}

const doesMatchFilters = (
    verbFilter?: string,
    itemFilter?: string,
    targetFilter?: string,
    roomFilter?: string
) => (interaction: Interaction): boolean => {
    if (verbFilter && interaction.verbId !== verbFilter) {
        return false
    }
    if (itemFilter && interaction.itemId !== itemFilter) {
        return false
    }
    if (targetFilter && interaction.targetId !== targetFilter) {
        return false
    }
    if (roomFilter && interaction.roomId !== roomFilter) {
        return false
    }
    return true
}

const getFilteredTargets = (
    filteredInteractions: Interaction[],
    targetLists: { ids: string[]; descriptions: string[]; }
): {
    ids: string[]; descriptions: string[];
} => {
    const ids: string[] = []
    const descriptions: string[] = []

    targetLists.ids.forEach((id, index) => {
        if (filteredInteractions.some(interaction => interaction.targetId === id)) {
            ids.push(id)
            descriptions.push(targetLists.descriptions[index])
        }
    })
    return { ids, descriptions }
}

export const InteractionEditor: React.FunctionComponent<Props> = ({
    updateInteractionList, deleteInteraction
}) => {
    const { gameDesign, changeOrAddInteraction } = useGameDesign()
    const { interactions, verbs, items, rooms } = gameDesign

    const [verbFilter, setVerbFilter] = useState('')
    const [itemFilter, setItemFilter] = useState('')
    const [targetFilter, setTargetFilter] = useState('')
    const [roomFilter, setRoomFilter] = useState('')

    const [interactionUnderConstruction, setInteractionUnderConstruction] = useState<Partial<Interaction> | undefined>(undefined)
    const [edittedIndex, setEdittedIndex] = useState<number | undefined>(undefined)

    const filteredInteractions = interactions.filter(doesMatchFilters(verbFilter, itemFilter, targetFilter, roomFilter))
    const filteredTargets = getFilteredTargets(filteredInteractions, getTargetLists(gameDesign))

    const saveInteraction = (interaction: Interaction) => {
        changeOrAddInteraction(interaction, edittedIndex)
        setEdittedIndex(undefined)
        setInteractionUnderConstruction(undefined)
    }

    const moveInteractionInList = (index: number, direction: 'down' | 'up') => {
        const { interactions } = gameDesign
        const endPlace = interactions.length - 1;
        const list = [...interactions]

        const [movedItem] = list.splice(index, 1)
        const newPlace = direction === 'down'
            ? index < endPlace ? index + 1 : 0
            : index > 0 ? index - 1 : endPlace

        list.splice(newPlace, 0, movedItem)
        return updateInteractionList(list)
    }

    return (
        <article>
            <EditorHeading heading="Interactions" />
            <TableContainer component={Paper}>
                <Table size="small" padding="normal" sx={{ captionSide: 'top' }}>
                    <caption>
                        <Typography>Showing {filteredInteractions.length}/{interactions.length} interactions</Typography>
                    </caption>
                    <TableHead>
                        <InteractionTableHeaders />
                        <TableRow>
                            <TableCell>
                                <Box minWidth={80}>
                                    <SelectInput
                                        optional
                                        inputHandler={verbFilter => setVerbFilter(verbFilter ?? '')}
                                        value={verbFilter}
                                        options={listIds(verbs)} />
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box minWidth={80}>
                                    <SelectInput
                                        optional
                                        inputHandler={targetFilter => setTargetFilter(targetFilter ?? '')}
                                        value={targetFilter}
                                        options={filteredTargets.ids}
                                        descriptions={filteredTargets.descriptions}
                                    />
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box minWidth={80}>
                                    <SelectInput
                                        optional
                                        inputHandler={itemFilter => setItemFilter(itemFilter ?? '')}
                                        value={itemFilter}
                                        options={listIds(items)}
                                        descriptions={getItemDescriptions(gameDesign)} />
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box minWidth={80}>
                                    <SelectInput
                                        optional
                                        inputHandler={roomFilter => setRoomFilter(roomFilter ?? '')}
                                        value={roomFilter}
                                        options={listIds(rooms)} />
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {interactions.map((interaction, index) => {
                            if (!filteredInteractions.includes(interaction)) { return <Fragment key={index} /> }
                            return (<InteractionTableRow key={index}
                                interaction={interaction}
                                index={index}
                                changeOrder={moveInteractionInList}
                                deleteInteraction={deleteInteraction}
                                openEditor={() => {
                                    setEdittedIndex(index)
                                    setInteractionUnderConstruction(cloneData(interaction))
                                }}
                            />)
                        })}
                    </TableBody>
                </Table>
            </TableContainer>


            <Box display='flex' justifyContent='flex-end' paddingY={2}>
                <Button
                    size="large"
                    onClick={() => {
                        setInteractionUnderConstruction({})
                        setEdittedIndex(undefined)
                    }}
                    variant="contained"
                    startIcon={<AddIcon />}
                >
                    Add new Interaction
                </Button>
            </Box>

            {interactionUnderConstruction &&
                <InteractionDialog key={edittedIndex}
                    confirm={saveInteraction}
                    initialState={interactionUnderConstruction}
                    cancelFunction={() => {
                        setEdittedIndex(undefined)
                        setInteractionUnderConstruction(undefined)
                    }}
                />
            }
        </article>
    )
}
