import { Component } from "preact";
import { GameData, GameProps } from "../../definitions/Game";
import * as initialGameData from '../../../data/fullGame';

import Game from "../Game";
import { cloneData } from "../../lib/clone";

const storageKey = "POINT_AND_CLICK"

export default class GamePlayer extends Component<{

}, { gameProps: GameProps, timestamp: number }> {

    refs: {}

    constructor(props) {
        super(props)
        this.state = {
            gameProps: this.getInitialGameState(),
            timestamp: Date.now()
        }
        this.save = this.save.bind(this)
        this.reset = this.reset.bind(this)
        this.load = this.load.bind(this)
    }

    save(data: GameData) {
        console.log('save data is', data)
        localStorage.setItem(storageKey, JSON.stringify(data))
    }

    load() {
        const jsonString = localStorage.getItem(storageKey)

        try {
            const data = JSON.parse(jsonString) as GameData
            const newGameProps = Object.assign({}, this.state.gameProps, data)
            console.log('newGameProps', newGameProps)

            this.setState({
                timestamp: Date.now(),
                gameProps: newGameProps
            })

        } catch (error) {
            console.error(error)
        }
    }

    reset() {
        console.log('Resetting props')
        this.setState({
            gameProps: this.getInitialGameState(),
            timestamp: Date.now()
        })
    }

    getInitialGameState(): GameProps {
        const clone = cloneData(initialGameData)
        const player = clone.characters.find(character => character.isPlayer)
        const startingRoom = clone.rooms.find(room => room.name === player?.room)

        return {
            ...clone,
            currentRoomName: startingRoom.name,
        }
    }

    render() {
        const { gameProps, timestamp } = this.state
        return <>
            <Game {...gameProps}
                save={this.save}
                reset={this.reset}
                load={this.load}
                key={timestamp} />
        </>
    }
}