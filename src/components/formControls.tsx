import { Ident } from "../definitions/BaseTypes"

export function ParallaxInput(props: {
    value: number,
    onChange: React.ChangeEventHandler<HTMLInputElement>
}) {
    return <>
        <label>parallax:</label>
        <input type='number'
            value={props.value}
            max={1} min={0} step={.05}
            onChange={props.onChange}
        />
    </>
}

export function IdentInput(props: {
    showType?: boolean
    value: Ident
    onChangeName?: React.ChangeEventHandler<HTMLInputElement>
    onChangeStatus?: React.ChangeEventHandler<HTMLInputElement>
    onChangeId?: React.ChangeEventHandler<HTMLInputElement>
}) {
    const { onChangeName, onChangeId, onChangeStatus, showType } = props
    const { type, name, id, status } = props.value
    return <>
        {showType && <label><b>{type}</b></label>}
        <div>
            <label>ID:</label>
            <input type='text'
                value={id}
                disabled={!onChangeId}
                onChange={onChangeId}
            />
        </div>
        <div>
            <label>name:</label>
            <input type='text'
                value={name}
                disabled={!onChangeName}
                onChange={onChangeName}
            />
        </div>
        <div>
            <label>status:</label>
            <input type='text'
                value={status}
                disabled={!onChangeStatus}
                onChange={onChangeStatus}
            />
        </div>
    </>
}