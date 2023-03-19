import { Component, ReactNode,  Fragment } from "react";
import styles from './styles.module.css';
import editorStyles from '../editorStyles.module.css'
import { icons } from "../dataEditors";


interface Props<T> {
    list: T[];
    describeItem: { (item: T, index: number): ReactNode };
    mutateList: { (newList: T[]): void };
    createItem?: { (): T | undefined };
    createButton?: 'END';
    noMoveButtons?: boolean;
    noDeleteButtons?: boolean;
    heavyBorders?: boolean;
    insertText?: string;
    deleteText?: string;
}


const buttonStyle = {
    UP: [editorStyles.button, editorStyles.moveButton],
    DOWN: [editorStyles.button, editorStyles.moveButton],
    INSERT: [editorStyles.button, editorStyles.plusButton],
    DELETE: [editorStyles.button, editorStyles.deleteButton],
}

export class ListEditor<T> extends Component<Props<T>> {

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
        const { insertText, deleteText } = this.props
        let clickFunction = () => { console.log('invliad button typr') }
        let buttonText = icons[role]
        switch (role) {
            case 'DELETE':
                clickFunction = () => { this.handleDelete(index) }
                if (deleteText) { buttonText = deleteText }
                break
            case 'INSERT':
                clickFunction = () => { this.handleInsert(index) }
                if (insertText) { buttonText = insertText }
                break
            case 'UP':
            case 'DOWN':
                clickFunction = () => { this.handleMove(index, role) }
                break
        }
        return <button className={buttonStyle[role].join(" ")} onClick={clickFunction}>{buttonText}</button>
    }

    render() {
        const { list, describeItem, createItem, createButton, noMoveButtons, heavyBorders = false, noDeleteButtons } = this.props
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
                                    {!noDeleteButtons && <>
                                        {this.renderButton('DELETE', index)}
                                    </>}
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