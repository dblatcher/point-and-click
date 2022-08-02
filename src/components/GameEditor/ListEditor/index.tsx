/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, ComponentChild, h, Fragment } from "preact";
import styles from './styles.module.css';

interface Props<T> {
    list: T[];
    describeItem: { (item: T, index: number): ComponentChild };
    mutateList: { (newList: T[]): void };
    createItem?: { (): T | undefined };
    createButton?: 'END';
    noMoveButtons?: boolean;
    heavyBorders?: boolean;
}

const icons = {
    UP: '🔼',
    DOWN: '🔽',
    INSERT: '➕',
    DELETE: '❌',
}
const buttonStyle = {
    UP: styles.moveButton,
    DOWN: styles.moveButton,
    INSERT: styles.plusButton,
    DELETE: styles.deleteButton,
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

    renderButton(role: 'UP' | 'DOWN' | 'INSERT' | 'DELETE', index: number) {
        let clickFunction = () => { console.log('invliad button typr') }
        switch (role) {
            case 'DELETE':
                clickFunction = () => { this.handleDelete(index) }
                break
            case 'INSERT':
                clickFunction = () => { this.handleInsert(index) }
                break
            case 'UP':
            case 'DOWN':
                clickFunction = () => { this.handleMove(index, role) }
                break
        }
        return <button className={buttonStyle[role]} onClick={clickFunction}>{icons[role]}</button>
    }

    render() {
        const { list, describeItem, createItem, createButton, noMoveButtons, heavyBorders = false } = this.props
        const listStyle = heavyBorders ? [styles.mainList, styles.heavyList].join(" ") : [styles.mainList].join(" ")

        return (
            <ul className={listStyle}>
                {list.map((item, index) => (
                    <Fragment key={index}>
                        {(!!createItem && createButton !== 'END') && (
                            <li>
                                <div className={styles.row}>
                                    <div>{''}</div>
                                    <nav className={styles.buttonSet}>
                                        {this.renderButton('INSERT', index)}
                                    </nav>
                                </div>
                            </li>
                        )}
                        <li>
                            <div className={styles.row}>
                                {describeItem(item, index)}
                                <nav className={styles.buttonSet}>
                                    {!noMoveButtons && <>
                                        {this.renderButton('UP', index)}
                                        {this.renderButton('DOWN', index)}
                                    </>}
                                    {this.renderButton('DELETE', index)}
                                </nav>
                            </div>
                        </li>
                    </Fragment>
                ))}
                {!!createItem && (
                    <li>
                        <div className={styles.row}>
                            <div>{''}</div>
                            <nav className={styles.buttonSet}>
                                {this.renderButton('INSERT', list.length)}
                            </nav>
                        </div>
                    </li>
                )}
            </ul>
        )
    }
}