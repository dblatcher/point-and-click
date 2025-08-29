import { useGameDesign } from "@/context/game-design-context"
import { changeHistory } from "@/definitions/old-versions/changes"
import { DB_VERSION } from "@/lib/indexed-db"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemText, ListSubheader } from "@mui/material"
import { FunctionComponent } from "react"


export const UpgradeNotice: FunctionComponent = () => {
    const { dispatchDesignUpdate, upgradeInfo } = useGameDesign()
    if (!upgradeInfo) {
        return null
    }

    const upgradesMade = changeHistory.filter(item => item.schemaVersion > upgradeInfo.sourceVersion)

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

                    {upgradesMade.map((item, index) => (
                        <List key={index}
                            disablePadding
                            dense
                            subheader={<ListSubheader component="div">Version {item.schemaVersion}</ListSubheader>}
                        >
                            {item.changes.map((change, index2) =>
                                <ListItem key={index2}>
                                    <ListItemText primary={change.description} />
                                </ListItem>
                            )}
                        </List>
                    ))}
                </DialogContent>
            )}

            <DialogActions>
                <Button onClick={() => dispatchDesignUpdate({ type: 'set-upgrade-info', data: undefined })}>ok</Button>
            </DialogActions>
        </Dialog >
    )
}