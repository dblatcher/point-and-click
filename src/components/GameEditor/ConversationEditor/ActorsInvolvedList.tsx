import React, { useState } from "react";
import { ArrayControl } from "../ArrayControl";
import { Box, BoxProps, Button, IconButton, Typography } from "@mui/material";
import { PickActorDialog } from "../PickActorDialog";
import { AddIcon, ClearIcon } from "../material-icons";

interface Props {
    actorsInvolved: string[], setActorsInvolved: { (newActorsInvolved: string[]): void }
    boxProps?: BoxProps
}

export const ActorsInvolvedList: React.FunctionComponent<Props> = ({ actorsInvolved, setActorsInvolved, boxProps = {} }) => {

    const [actorDialogOpen, setActorDialogOpen] = useState<boolean>(false)

    return <Box {...boxProps}>
        <Typography>Actors involved</Typography>
        <ArrayControl
            noMoveButtons
            list={actorsInvolved}
            noDeleteButtons
            buttonSize="small"
            describeItem={(actorId) => <Box>
                <IconButton
                    aria-label={`remove ${actorId}`}
                    onClick={() => {
                        setActorsInvolved(actorsInvolved.filter(id => id !== actorId))
                    }} ><ClearIcon /></IconButton>
                <Typography variant="overline">{actorId}</Typography>
            </Box>}
            mutateList={setActorsInvolved}

        />
        <IconButton aria-label={`add actor`} onClick={() => setActorDialogOpen(true)}>
            <AddIcon />
        </IconButton>

        <PickActorDialog
            isOpen={actorDialogOpen}
            close={() => { setActorDialogOpen(false) }}
            onSelect={(actorId) => {
                if (actorsInvolved.includes(actorId)) {
                    return
                }
                setActorsInvolved([...actorsInvolved, actorId])
            }} />
    </Box>

}