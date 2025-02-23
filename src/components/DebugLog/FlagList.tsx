import { FlagMap } from "@/definitions"
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import { FlagOutlinedIcon, FlagFilledIcon } from "../GameEditor/material-icons"

export const FlagList = ({ flagMap }: { flagMap: FlagMap }) => {

    const flags = Object.entries(flagMap)

    return (
        <List dense disablePadding>
            {flags.map(([flagKey, flag]) => (
                <ListItem key={flagKey}>
                    <ListItemIcon>
                        {flag?.value ? <FlagFilledIcon /> : <FlagOutlinedIcon />}
                    </ListItemIcon>
                    <ListItemText primary={flagKey} secondary={flag?.description} />
                </ListItem>
            ))}
        </List>
    )
}