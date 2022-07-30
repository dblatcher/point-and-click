/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, ComponentChild, h } from "preact";
import editorstyles from '../editorStyles.module.css';
import styles from './styles.module.css';

interface Props<T> {
    list: T[];
    describeItem: { (item: T, index: number): ComponentChild };
    mutateList: { (newList: T[]): void };
    createItem: { (): T | undefined };
}

export class ListEditor<T extends {}> extends Component<Props<T>> {

    handleDelete(index: number) {
        const { list, mutateList } = this.props
        const listCopy = [...list]
        listCopy.splice(index, 1)
        mutateList(listCopy)
    }

    handleInsert(index: number) {
        const { list, mutateList, createItem } = this.props
        const listCopy = [...list]
        const newItem = createItem()
        if (!newItem) { return }
        listCopy.splice(index, 0, newItem)
        mutateList(listCopy)
    }

    render() {
        const { list, describeItem } = this.props
        return (
            <article>
                <ul className={styles.mainList}>
                    {list.map((item, index) => (
                        <li key={index}>
                            <div className={editorstyles.row}>
                                <button className={styles.plusButton} onClick={() => { this.handleInsert(index) }}>+</button>
                            </div>
                            <div className={editorstyles.row}>
                                {describeItem(item, index)}
                                <button className={styles.deleteButton} onClick={() => { this.handleDelete(index) }}>x</button>
                            </div>
                        </li>
                    ))}
                    <li>
                        <div className={editorstyles.row}>
                            <button className={styles.plusButton} onClick={() => { this.handleInsert(list.length) }}>+</button>
                        </div>
                    </li>
                </ul>
            </article>
        )
    }
}