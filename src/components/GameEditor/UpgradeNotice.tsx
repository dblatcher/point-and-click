import { useGameDesign } from "@/context/game-design-context"
import { changeHistory } from "@/definitions/old-versions/changes"
import { DB_VERSION } from "@/lib/indexed-db"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemText } from "@mui/material"
import { FunctionComponent } from "react"


export const UpgradeNotice: FunctionComponent = () => {
    const { dispatchDesignUpdate, upgradeInfo } = useGameDesign()
    if (!upgradeInfo) {
        return null
    }

    return (
        <Dialog open={!!upgradeInfo}>
            <DialogTitle>Upgrade Notice</DialogTitle>
            {!!upgradeInfo && (
                <DialogContent>
                    <DialogContentText>
                        The design you loaded from &quot;{upgradeInfo.sourceIdentifier}&quot; was built in a previous version of the editor (v{upgradeInfo.sourceVersion}).
                    </DialogContentText>
                    <DialogContentText>
                        It has been upgraded to v{DB_VERSION}.
                    </DialogContentText>

                    <List>
                        {changeHistory.map((item, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={`Version ${item.schemaVersion}`}
                                    secondary={
                                        <ul>
                                            {item.changes.map((change, index2) =>
                                                <li key={index2}>{change.description}</li>
                                            )}
                                        </ul>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            )}

            <DialogActions>
                <Button onClick={() => dispatchDesignUpdate({ type: 'set-upgrade-info', data: undefined })}>ok</Button>
            </DialogActions>
        </Dialog>
    )
}