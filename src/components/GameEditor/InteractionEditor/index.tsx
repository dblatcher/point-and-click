import { AddIcon, InteractionIcon } from "@/components/GameEditor/material-icons";
import { useGameDesign } from "@/context/game-design-context";
import { Interaction } from "point-click-lib";
import { cloneData } from "@/lib/clone";
import { listIds } from "@/lib/util";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import { EditorHeading } from "../layout/EditorHeading";
import { getItemDescriptions, getTargetLists } from "./getTargetLists";
import { InteractionDialog } from "./InteractionDialog";
import { InteractionTableRow } from "./InteractionTableRow";
import { HeadingCellWithFilter } from "./HeadingCellWithFilter";


const doesMatchFilters = (
    verbFilter: string[],
    itemFilter: string[],
    targetFilter: string[],
    roomFilter: string[]
) => (interaction: Interaction): boolean => {
    if (verbFilter.length > 0 && !(verbFilter.includes(interaction.verbId))) {
        return false
    }
    if (itemFilter.length > 0 && (!interaction.itemId || !(itemFilter.includes(interaction.itemId)))) {
        return false
    }
    if (targetFilter.length > 0 && !(targetFilter.includes(interaction.targetId))) {
        return false
    }
    if (roomFilter.length > 0 && (!interaction.roomId || !(roomFilter.includes(interaction.roomId)))) {
        return false
    }
    return true
}

export const InteractionEditor: React.FunctionComponent = () => {
    const { gameDesign, changeOrAddInteraction, applyModification, deleteInteraction } = useGameDesign()
    const { interactions, verbs, items, rooms } = gameDesign

    const [verbFilter, setVerbFilter] = useState<string[]>([])
    const [itemFilter, setItemFilter] = useState<string[]>([])
    const [targetFilter, setTargetFilter] = useState<string[]>([])
    const [roomFilter, setRoomFilter] = useState<string[]>([])

    const [interactionUnderConstruction, setInteractionUnderConstruction] = useState<Partial<Interaction> | undefined>(undefined)
    const [edittedIndex, setEdittedIndex] = useState<number | undefined>(undefined)

    const filteredInteractions = interactions.filter(doesMatchFilters(verbFilter, itemFilter, targetFilter, roomFilter))

    const { ids: targetIds, descriptions: targetDescriptions } = getTargetLists(gameDesign);

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
        return applyModification('change interaction order', { interactions: list })
    }

    return (
        <article style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            maxHeight: '80vh' // TO DO - any way to avoid this while preserving the sticky header?
        }}>
            <EditorHeading icon={InteractionIcon} heading="Interactions" helpTopic="interactions" >
                <Box display='flex' justifyContent='flex-end' paddingY={2} alignItems={'center'} gap={2}>
                    <Typography>Showing {filteredInteractions.length}/{interactions.length} interactions</Typography>
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
            </EditorHeading>
            <TableContainer sx={{ flex: 1 }}>
                <Table size="small" padding="normal" stickyHeader>
                    <TableHead>
                        <TableRow sx={{ verticalAlign: 'top' }}>
                            <HeadingCellWithFilter label="Verb"
                                list={verbFilter} options={listIds(verbs)} setList={setVerbFilter} />
                            <HeadingCellWithFilter label="Target" list={targetFilter}
                                options={targetIds}
                                descriptions={targetDescriptions}
                                setList={setTargetFilter}
                            />
                            <HeadingCellWithFilter label="Item"
                                list={itemFilter}
                                setList={setItemFilter}
                                options={listIds(items)}
                                descriptions={getItemDescriptions(gameDesign)} />
                            <HeadingCellWithFilter label="Room"
                                list={roomFilter}
                                setList={setRoomFilter}
                                options={listIds(rooms)} />
                            <TableCell>Consequences</TableCell>
                            <TableCell>Conditions</TableCell>
                            <TableCell></TableCell>
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

            {interactionUnderConstruction &&
                <InteractionDialog key={edittedIndex}
                    confirm={saveInteraction}
                    initialInteraction={interactionUnderConstruction}
                    cancel={() => {
                        setEdittedIndex(undefined)
                        setInteractionUnderConstruction(undefined)
                    }}
                />
            }
        </article>
    )
}
