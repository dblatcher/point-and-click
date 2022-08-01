/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, ComponentChild, h, Fragment } from "preact";
import editorstyles from '../editorStyles.module.css';
import styles from './styles.module.css';

interface Props<T> {
    list: T[];
    describeItem: { (item: T, index: number): ComponentChild };
    mutateList: { (newList: T[]): void };
    createItem?: { (): T | undefined };
    createButton?: 'END';
    noMoveButtons?: boolean;
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
        if (!createItem) { return }
        const listCopy = [...list]
        const newItem = createItem()
        if (!newItem) { return }
        listCopy.splice(index, 0, newItem)
        mutateList(listCopy)
    }

    handleMove(index: number, direction: 'UP' | 'DOWN') {
        const { list, mutateList } = this.props
        const reinsertIndex = direction === 'UP' ? index - 1 : index + 1
        if (reinsertIndex < 0 || reinsertIndex >= list.length) { return }
        const listCopy = [...list]
        const [itemToMove] = listCopy.splice(index, 1)


        listCopy.splice(reinsertIndex, 0, itemToMove)
        mutateList(listCopy)
    }

    render() {
        const { list, describeItem, createItem, createButton, noMoveButtons } = this.props
        return (
            <article>
                <ul className={styles.mainList}>
                    {list.map((item, index) => (
                        <li key={index}>

                            {(!!createItem && createButton !== 'END') && (
                                <div className={editorstyles.row}>
                                    <button className={styles.plusButton} onClick={() => { this.handleInsert(index) }}>INSERT NEW ➕</button>
                                </div>
                            )}
                            <div className={editorstyles.row}>
                                {describeItem(item, index)}
                                <div className={styles.buttonSet}>
                                    {!noMoveButtons && <>
                                        <button className={styles.moveButton}
                                            onClick={() => { this.handleMove(index, 'UP') }}>
                                            🔼
                                        </button>
                                        <button className={styles.moveButton}
                                            onClick={() => { this.handleMove(index, 'DOWN') }}>
                                            🔽
                                        </button>
                                    </>}
                                    <button className={styles.deleteButton}
                                        onClick={() => { this.handleDelete(index) }}>
                                        ❌
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                    {!!createItem && (
                        <li>
                            <div className={editorstyles.row}>
                                <button className={styles.plusButton} onClick={() => { this.handleInsert(list.length) }}>INSERT NEW ➕</button>
                            </div>
                        </li>
                    )}
                </ul>
            </article>
        )
    }
}