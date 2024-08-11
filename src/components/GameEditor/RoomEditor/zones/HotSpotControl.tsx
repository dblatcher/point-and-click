import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { OptionalNumberInput, } from "@/components/SchemaForm/OptionalNumberInput";
import { StringInput } from "@/components/SchemaForm/StringInput";
import { useGameDesign } from "@/context/game-design-context";
import { HotspotZone } from "@/definitions";
import { clamp } from "@/lib/util";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, ButtonGroup, Stack } from "@mui/material";
import { useState } from "react";
import { AccoridanedContent } from "../../AccordianedContent";
import { InteractionDialog } from "../../InteractionEditor/InteractionDialog";
import { PickInteractionDialog } from "../../InteractionEditor/PickInteractionDialog";
import { ClickEffect } from "../ClickEffect";
import { ShapeChangeFunction, ShapeControl, ValidShapeType } from "./ShapeControl";
import { ButtonWithConfirm } from "../../ButtonWithConfirm";

interface Props {
    roomId: string;
    hotspot: HotspotZone;
    index: number;
    change: ShapeChangeFunction;
    remove: { (index: number, type: ValidShapeType): void };
    setClickEffect: { (clickEffect: ClickEffect): void };
}

export function HotspotControl({ roomId, hotspot, index, change, remove, setClickEffect }: Props) {
    const { parallax, type, walkToX, walkToY, id, status, name } = hotspot
    const { gameDesign, changeInteraction } = useGameDesign()
    const [interactionDialogOpen, setInteractionDialogOpen] = useState(false)
    const [pickInteractionDialogOpen, setPickInteractionDialogOpen] = useState(false)
    const [interactionIndex, setInteractionIndex] = useState<number | undefined>(undefined)

    const handleInteractionButton = () => {
        if (gameDesign.interactions.some(interaction => interaction.targetId === id)) {
            setPickInteractionDialogOpen(true)
        } else {
            setInteractionDialogOpen(true)
        }
    }

    const handlePickInteractionIndex = (index: number | undefined) => {
        setInteractionDialogOpen(true)
        setPickInteractionDialogOpen(false)
        setInteractionIndex(index)
    }

    return (
        <Box component={'article'} spacing={0}>
            <AccoridanedContent tabs={[
                {
                    label: 'hotspot',
                    content: <>
                        <StringInput
                            label="id" value={id}
                            inputHandler={(value) => change(index, 'id', value, type)} />
                        <StringInput
                            label="name" value={name || ''}
                            inputHandler={(value) => change(index, 'name', value, type)} />
                        <StringInput
                            label="status" value={status || ''}
                            inputHandler={(value) => change(index, 'status', value, type)} />
                        <ButtonGroup>
                            <Button onClick={handleInteractionButton}
                                variant="outlined"
                                startIcon={<EditIcon />}
                            >interactions</Button>
                            <ButtonWithConfirm
                                label="Delete Hotspot"
                                onClick={() => { remove(index, 'hotspot') }}
                                confirmationText={`Delete hotspot "${hotspot.id}"`}
                                buttonProps={{
                                    variant: "outlined",
                                    color: 'warning',
                                    startIcon: <DeleteIcon />
                                }}
                            />
                        </ButtonGroup>
                    </>
                },
                {
                    label: 'walk to point', content: (
                        <Box>
                            <OptionalNumberInput
                                value={walkToX} label="X: "
                                inputHandler={value => { change(index, 'walkToX', value, type) }} />
                            <OptionalNumberInput
                                value={walkToY} label="Y: "
                                inputHandler={value => { change(index, 'walkToY', value, type) }} />
                            <Button
                                variant="outlined"
                                onClick={() => { setClickEffect({ type: 'HOTSPOT_WALKTO_POINT', index }) }}
                            >select point</Button>
                        </Box>
                    )
                },
                {
                    label: 'shape and position', content: <>
                        <Box maxWidth={100}>
                            <NumberInput value={parallax}
                                inputHandler={(value) => { change(index, 'parallax', clamp(value, 2, 0), type) }}
                                label="parallax"
                                max={2} min={0} step={.05}
                            />
                        </Box>
                        <ShapeControl
                            shape={hotspot} index={index}
                            setClickEffect={setClickEffect}
                            type='hotspot'
                            change={change}
                            remove={remove} />
                    </>
                },
            ]} />


            {interactionDialogOpen &&
                <InteractionDialog
                    gameDesign={gameDesign}
                    initialState={typeof interactionIndex === 'number' ? gameDesign.interactions[interactionIndex] : {
                        targetId: id,
                        roomId,
                    }}
                    cancelFunction={() => { setInteractionDialogOpen(false) }}
                    confirm={(interaction) => {
                        setInteractionDialogOpen(false)
                        changeInteraction(interaction, interactionIndex)
                    }}
                />
            }

            <PickInteractionDialog
                isOpen={pickInteractionDialogOpen}
                close={() => setPickInteractionDialogOpen(false)}
                pickIndex={handlePickInteractionIndex}
                criteria={interaction => interaction.targetId === id && (!interaction.roomId || interaction.roomId === roomId)}
            />
        </Box>
    )
}