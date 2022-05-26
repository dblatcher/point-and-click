import { ComponentChild } from "preact"
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

export function NumberInput(props: {
    label: string
    value: number
    onInput: React.ChangeEventHandler<HTMLInputElement>
}) {
    const { label, value, onInput } = props
    return <>
        <label>{label}</label>
        <input type='number' value={value} onInput={onInput} />
    </>
}

export function Warning(props: { children?: ComponentChild }) {
    return (
        <>
            <b style={{ color: 'red' }}>!</b>
            {props.children}
            <b style={{ color: 'red' }}>!</b>
        </>
    )
}