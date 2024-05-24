import { FunctionComponent, ReactNode } from "react";


type FieldProps = {
    block?: boolean;
    className?: string;
    label?: string;
}
const FieldWrapper: FunctionComponent<FieldProps & { children?: ReactNode }> = ({ children, block, className, label }) => {
    return block
        ? <div className={className}>
            {label && <label>{label}</label>}
            {children}
        </div>
        : <>
            {label && <label>{label}</label>}
            {children}
        </>
}

export const TriStateInput: FunctionComponent<FieldProps & {
    name?: string;
    value: boolean | undefined;
    inputHandler: { (value: boolean | undefined): void };
}> = (props) => {


    return <FieldWrapper {...props}>
        <div>
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
    </FieldWrapper>
}
