import { ComponentChild, FunctionalComponent, Fragment, h, JSX } from "preact"
import { useEffect, useRef, useState } from "preact/hooks";
import { eventToBoolean, eventToNumber, eventToString } from "../../lib/util";
import { Ident } from "src"
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
    inputHandler: { (value: number): void };
    max?: number;
    min?: number;
    step?: number;
    type?: 'number' | 'range';
}> = (props) => {

    const { type = 'number' } = props
    const width = type === 'range' ? '5rem' : '3rem';

    const sendValue: JSX.EventHandler<JSX.TargetedEvent> = (event) => {
        props.inputHandler(eventToNumber(event))
    }

    return <>
        <label>{props.label}</label>
        <input type={type}
            style={{ width }}
            value={props.value}
            max={props.max}
            min={props.min}
            step={props.step}
            onInput={sendValue}
        />
    </>
}


export const OptionalNumberInput: FunctionalComponent<{
    label: string;
    value: number | undefined;
    inputHandler: { (value: number | undefined): void };
    max?: number;
    min?: number;
    step?: number;
}> = (props) => {

    const numberFieldRef = useRef<HTMLInputElement>(null)

    const sendNumberValue: JSX.EventHandler<JSX.TargetedEvent> = (event) => {
        props.inputHandler(eventToNumber(event))
    }

    const toggleUndefined: JSX.EventHandler<JSX.TargetedEvent> = (event) => {
        const { checked } = event.target as HTMLInputElement;
        if (checked) {
            return props.inputHandler(undefined)
        }
        const numberInputValue = Number(numberFieldRef.current?.value)
        if (!isNaN(numberInputValue)) {
            return props.inputHandler(numberInputValue)
        }
        props.inputHandler(props.min || 0)
    }

    return <>
        <label>{props.label}</label>

        <span>
            <label>undefined:</label>
            <input type="checkbox" checked={typeof props.value === 'undefined'} onChange={toggleUndefined} />
        </span>

        <input type='number' disabled={typeof props.value === 'undefined'}
            style={{ width: '3rem' }}
            value={props.value}
            max={props.max}
            min={props.min}
            step={props.step}
            onInput={sendNumberValue}
            ref={numberFieldRef}
        />
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

export const StringInput: FunctionalComponent<{
    label?: string;
    value: string;
    type?: string;
    inputHandler: { (value: string): void };
}> = (props) => {
    const { label, type = 'text', value, inputHandler } = props

    if (type === 'textArea') {

        return <>
            {label && <label>{label}</label>}
            <textarea onInput={
                (event): void => {
                    console.log(event)
                    inputHandler(eventToString(event))
                }
            } >{value}</textarea>
        </>
    }

    return <>
        {label && <label>{label}</label>}
        <input value={value} type={type} onInput={
            (event): void => {
                inputHandler(eventToString(event))
            }
        } />
    </>
}

export const OptionalStringInput: FunctionalComponent<{
    label?: string;
    value: string | undefined;
    type?: string;
    inputHandler: { (value: string | undefined): void };
}> = (props) => {
    const { label, type = 'text', value, inputHandler } = props

    const textFieldRef = useRef<HTMLInputElement>(null)

    const sendStringValue: JSX.EventHandler<JSX.TargetedEvent> = (event) => {
        props.inputHandler(eventToString(event))
    }

    const toggleUndefined: JSX.EventHandler<JSX.TargetedEvent> = (event) => {
        const { checked } = event.target as HTMLInputElement;
        if (checked) {
            return props.inputHandler(undefined)
        }
        const textInputValue = textFieldRef.current?.value
        props.inputHandler(textInputValue || '')
    }

    return <>
        {label && <label>{label}</label>}
        <span>
            <label>undefined:</label>
            <input type="checkbox" checked={typeof props.value === 'undefined'} onChange={toggleUndefined} />
        </span>

        <input type={type} disabled={typeof props.value === 'undefined'}
            value={props.value}
            onInput={sendStringValue}
            ref={textFieldRef}
        />
    </>

}

export const CheckBoxInput: FunctionalComponent<{
    label: string;
    value?: boolean;
    inputHandler: { (value: boolean): void };
}> = (props) => {

    const sendValue: JSX.EventHandler<JSX.TargetedEvent> = (event) => {
        props.inputHandler(eventToBoolean(event))
    }
    return <>
        <label>{props.label}</label>
        <input type='checkbox'
            checked={props.value}
            onInput={sendValue}
        />
    </>
}

export const TriStateInput: FunctionalComponent<{
    label: string;
    name?: string;
    value: boolean | undefined;
    inputHandler: { (value: boolean | undefined): void };
}> = (props) => {


    return <>
        <div>
            <label><b>{props.label}:</b></label>
            <label>undefined</label>
            <input type='radio'
                name={props.name || props.label}
                checked={props.value === undefined}
                onInput={(): void => props.inputHandler(undefined)}
            />|
            <label>true</label>
            <input type='radio'
                name={props.name || props.label}
                checked={props.value === true}
                onInput={(): void => props.inputHandler(true)}
            />|
            <label>false</label>
            <input type='radio'
                name={props.name || props.label}
                checked={props.value === false}
                onInput={(): void => props.inputHandler(false)}
            />

        </div>
    </>
}

export const DeleteButton: FunctionalComponent<{
    label: string;
    onClick: JSX.EventHandler<JSX.TargetedEvent>;
    noConfirmation?: boolean;
    confirmationText?: string;
}> = (props) => {

    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)

    const handleFirstButton = props.noConfirmation
        ? props.onClick
        : (): void => { setShowConfirmation(true) }

    if (!showConfirmation) {
        return <div>
            <button onClick={handleFirstButton}>[x]{props.label}</button>
        </div>
    }

    const warningText = props.confirmationText || `Are you sure you want to ${props.label}?`
    return <div>
        <p>
            <Warning>{warningText}</Warning>
        </p>
        <button onClick={(): void => {
            setShowConfirmation(false);
        }}>cancel</button>
        <button onClick={(event): void => {
            setShowConfirmation(false);
            props.onClick.bind(undefined as never)(event);
        }}>confirm</button>
    </div>
}

export const SelectInput: FunctionalComponent<{
    label?: string;
    value: string;
    onSelect: { (item: string): void };
    items: string[];
    descriptions?: string[];
    haveEmptyOption?: boolean;
    emptyOptionLabel?: string;
}> = (props) => {

    const { descriptions, items, haveEmptyOption, emptyOptionLabel } = props

    return <>
        {props.label && <label>{props.label}:</label>}
        <select value={props.value} readonly={true}
            onChange={(event): void => { props.onSelect(eventToString(event)) }}>
            {haveEmptyOption && <option value=''>{emptyOptionLabel || "(select)"}</option>}
            {items.map((item, index) =>
                <option key={index} value={item}>
                    {descriptions && descriptions[index] ? descriptions[index] : item}
                </option>
            )}
        </select>
    </>
}

export const SelectAndConfirmInput: FunctionalComponent<{
    label?: string;
    onSelect: { (item: string): void };
    items: string[];
    descriptions?: string[];
}> = (props) => {
    const { descriptions, items, label, onSelect } = props
    const [value, setValue] = useState(items[0])
    useEffect(() => {
        setValue(items[0])
    }, [items])

    return (
        <>
            {label && <label>{label}:</label>}
            <SelectInput items={items} descriptions={descriptions} value={value} onSelect={setValue} />
            <button onClick={() => onSelect(value)}>{value}</button>
        </>
    )
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