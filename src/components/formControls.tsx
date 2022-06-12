import { ComponentChild, FunctionalComponent, Fragment, h, JSX } from "preact"
import { useState } from "preact/hooks";
import { Ident } from "../definitions/BaseTypes"
import styles from './editorStyles.module.css';

export const ParallaxInput: FunctionalComponent<{
    value: number;
    onChange: JSX.EventHandler<JSX.TargetedEvent>;
}> = (props) => {
    return <>
        <label>parallax:</label>
        <input type='number'
            value={props.value}
            max={1} min={0} step={.05}
            onChange={props.onChange}
        />
    </>
}


export const IdentInput: FunctionalComponent<{
    showType?: boolean;
    value: Ident;
    onChangeName?: JSX.EventHandler<JSX.TargetedEvent>;
    onChangeStatus?: JSX.EventHandler<JSX.TargetedEvent>;
    onChangeId?: JSX.EventHandler<JSX.TargetedEvent>;
}> = (props) => {
    const { onChangeName, onChangeId, onChangeStatus, showType } = props
    const { type, name, id, status } = props.value
    return <>
        {showType && <label><b>{type}</b></label>}
        <div className={styles.row}>
            <label>ID:</label>
            <input type='text'
                value={id}
                disabled={!onChangeId}
                onChange={onChangeId}
            />
        </div>
        <div className={styles.row}>
            <label>name:</label>
            <input type='text'
                value={name}
                disabled={!onChangeName}
                onChange={onChangeName}
            />
        </div>
        <div className={styles.row}>
            <label>status:</label>
            <input type='text'
                value={status}
                disabled={!onChangeStatus}
                onChange={onChangeStatus}
            />
        </div>
    </>
}


export const NumberInput: FunctionalComponent<{
    label: string;
    value: number;
    onInput: JSX.EventHandler<JSX.TargetedEvent>;
    max?: number;
    min?: number;
    step?: number;
}> = (props) => {

    const { label } = props
    return <>
        <label>{label}</label>
        <input type='number'{...props} />
    </>
}

export const TextInput: FunctionalComponent<{
    label: string;
    value: string;
    type?: string;
    onInput: JSX.EventHandler<JSX.TargetedEvent>;
}> = (props) => {

    const { label, type = 'text' } = props
    return <>
        <label>{label}</label>
        <input {...props} type={type} />
    </>
}

export const DeleteButton: FunctionalComponent<{
    label: string;
    onClick: JSX.EventHandler<JSX.TargetedEvent>;
    noConfirmation?: boolean;
}> = (props) => {

    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)

    const handleButton = props.noConfirmation
        ? props.onClick
        : (): void => { setShowConfirmation(true) }

    if (!showConfirmation) {
        return <div>
            <button onClick={handleButton}>[x]{props.label}</button>
        </div>
    }

    return <div>
        <p>
            <Warning>Are you sure you want to {props.label}?</Warning>
        </p>
        <button onClick={(): void => { setShowConfirmation(false) }}>cancel</button>
        <button onClick={props.onClick}>confirm</button>
    </div>
}

export const Warning: FunctionalComponent<{
    children?: ComponentChild;
}> = (props) => {
    return (
        <>
            <b style={{ color: 'red' }}>!</b>
            {props.children}
            <b style={{ color: 'red' }}>!</b>
        </>
    )
}