import { useGameDesign } from "@/context/game-design-context"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material"
import { FunctionComponent } from "react"


export const UpgradeNotice: FunctionComponent = () => {

    const { dispatchDesignUpdate, upgradeInfo } = useGameDesign()

    if (!upgradeInfo) {
        return null
    }

    return (
        <Dialog open={!!upgradeInfo}>

            {!!upgradeInfo && (
                <DialogContent>
                    <DialogContentText>
                        The design you loaded from &quot;{upgradeInfo.sourceIdentifier}&quot; was built in a previous version of the editor (v{upgradeInfo.sourceVersion}).
                    </DialogContentText>
                    <DialogContentText>
                        It has been upgraded.
                    </DialogContentText>
                </DialogContent>
            )}

            <DialogActions>
                <Button onClick={() => dispatchDesignUpdate({ type: 'set-upgrade-info', data: undefined })}>ok</Button>
            </DialogActions>

        </Dialog>
    )

}