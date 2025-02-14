import { OrderType, orderTypes } from "@/definitions/Order"
import { Button, ButtonGroup } from "@mui/material"
import { getOrderIcon } from "./SequenceEditor/get-order-details"


interface Props {
    handler: { (ordertype: OrderType): { (): void } }
    selectedType?: OrderType
}

export const OrderTypeButtons = ({ handler, selectedType }: Props) => {

    return <ButtonGroup fullWidth sx={{ marginBottom: 1 }}>
        {orderTypes.map(type => {
            const OrderIcon = getOrderIcon(type)
            return <Button
                size="small"
                key={type}
                variant={type === selectedType ? 'contained' : 'outlined'}
                startIcon={<OrderIcon />}
                onClick={handler(type)}
            >{type}</Button>
        }
        )}
    </ButtonGroup>
}