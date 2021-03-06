/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h, Fragment } from "preact";
import { GameCondition, GameData } from "../../definitions/Game";
import { startingGameCondition } from '../../../data/fullGame';
import Game from "../Game";
import { cloneData } from "../../lib/clone";
import { populate } from "../../services/populateServices";

populate()
const storageKey = "POINT_AND_CLICK"


export default class GamePlayer extends Component<{}, {
    gameCondition: GameCondition;
    timestamp: number;
}> {

    constructor(props: GamePlayer['props']) {
        super(props)
        this.state = {
            gameCondition: this.getInitialGameCondtions(),
            timestamp: Date.now()
        }
        this.save = this.save.bind(this)
        this.reset = this.reset.bind(this)
        this.load = this.load.bind(this)
    }

    save(data: GameData) {
        localStorage.setItem(storageKey, JSON.stringify(data))
    }

    load() {
        const jsonString = localStorage.getItem(storageKey)
        if (!jsonString) {
            console.error('NO SAVE FILE', storageKey)
            return
        }

        try {
            const data = JSON.parse(jsonString) as GameData
            const loadedConditions = Object.assign({}, this.state.gameCondition, data)

            this.setState({
                timestamp: Date.now(),
                gameCondition: loadedConditions
            })

        } catch (error) {
            console.error(error)
        }
    }

    reset() {
        this.setState({
            gameCondition: this.getInitialGameCondtions(),
            timestamp: Date.now()
        })
    }

    getInitialGameCondtions(): GameCondition {
        return {
            ...cloneData(startingGameCondition),
        }
    }

    render() {
        const { gameCondition, timestamp } = this.state
        return <>
            <Game {...gameCondition}
                save={this.save}
                reset={this.reset}
                load={this.load}
                key={timestamp} />
        </>
    }
}