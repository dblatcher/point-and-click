import { useGameDesign } from "@/context/game-design-context";
import { getGameFromApi, ValidGameId } from "@/lib/api-usage";
import { Dialog, DialogContent, DialogContentText, DialogTitle, IconButton, List } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";
import { DesignListItem } from "../DesignListItem";
import { ClearIcon } from "./material-icons";

interface Props {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const TemplateDesignDialog: React.FunctionComponent<Props> = ({ isOpen, setIsOpen }) => {
    const { handleIncomingDesign } = useGameDesign()

    const loadGame = async (gameId: ValidGameId) => {
        const result = await getGameFromApi(gameId)
        if (!result.success) {
            alert(result.failureMessage)
            return
        }
        const { gameDesign: design, soundAssets, imageAssets } = result.data
        const success = handleIncomingDesign('template', {
            design, soundAssets, imageAssets
        });
        if (success) {
            setIsOpen(false)
        }
    }


    return <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
            <span>Templates Designs</span>
            <IconButton onClick={() => setIsOpen(false)}><ClearIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                Load a template design to get started.
                This will overwrite your current design.
            </DialogContentText>
            <List dense>
                <DesignListItem
                    title="Test game"
                    description={'A test game to illustrate how some of the features work.'}
                    onClick={() => loadGame('test')} />
            </List>
        </DialogContent>
    </Dialog>
}
