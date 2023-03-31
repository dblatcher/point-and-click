
interface Props {
    save?: { (): void };
    reset?: { (): void };
    load?: { (): void };
}

export const SaveMenu = ({ save, reset, load }: Props) => {

    return <>
        {!!save &&
            <button onClick={save}>SAVE</button>
        }
        {!!reset &&
            <button onClick={reset}>RESET</button>
        }
        {!!load &&
            <button onClick={load}>LOAD</button>
        }
    </>

}