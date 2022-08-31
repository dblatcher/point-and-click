import { Component, ComponentChild, h } from "preact";
import { StringInput } from "../formControls";
import styles from './styles.module.css';
import editorStyles from '../editorStyles.module.css';
import { icons } from "../dataEditors";


interface Props<T> {
    record: Record<string, T | undefined>;
    describeValue: { (key: string, value: T): ComponentChild };
    setEntry: { (key: string, value: T | undefined): void };
    addEntry: { (key: string): void };
    renderKeys?: boolean;
};

interface State {
    newKey?: string;
}

export class RecordEditor<T> extends Component<Props<T>, State> {

    constructor(props: Props<T>) {
        super(props)
        this.state = {

        }
        this.renderEntry = this.renderEntry.bind(this)
    }

    renderEntry(entry: [string, T | undefined]) {
        const { describeValue, setEntry, renderKeys = false } = this.props
        const [key, value] = entry

        if (!value) { return null }

        return (
            <li key={key} className={styles.row}>
                {renderKeys && <b>{key}</b>}
                <button
                    className={editorStyles.deleteButton}
                    onClick={() => { setEntry(key, undefined) }}
                >{icons.DELETE}</button>
                {describeValue(key, value)}
            </li>
        )
    }

    render() {
        const { record, addEntry } = this.props
        const { newKey = '' } = this.state
        return <div>
            <ul className={styles.mainList}>
                {Object.entries(record).map(this.renderEntry)}
            </ul>
            <hr />
            <StringInput value={newKey} label={'add entry'}
                inputHandler={newKey => this.setState({ newKey })}
            />
            <button
                className={editorStyles.plusButton}
                onClick={() => { addEntry(newKey) }}
            >{icons.INSERT}</button>
        </div>
    }
}