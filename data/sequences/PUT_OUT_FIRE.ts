import { Sequence } from "../../src/definitions/Sequence";

export const PUT_OUT_FIRE: Sequence = [
    {
        characterOrders: {
            PLAYER: [
                {
                    type: 'move', steps: [{
                        x: 240, y: 10
                    }]
                },
                {
                    type: 'talk', steps: [{
                        text: 'I wish to put it out.', time: 150,
                    }]
                }
            ]
        }
    },
    {
        characterOrders:{
            PLAYER: [
                {
                    type: 'talk', steps: [{
                        text: 'ok...', time: 100,
                    }]
                }
            ]
        },
        thingOrders:{
            FIRE:[
                {
                    type:'act',steps:[{
                        duration:200, animation:'fade'
                    }]
                }
            ]
        },
        immediateConsequences: [
            {type:'changeStatus', targetId:'FIRE', status:'out', targetType:'thing'}
        ]
    },
    {
        characterOrders: {
            PLAYER: [
                {
                    type: 'talk', steps: [{
                        text: 'It is out now.', time: 150,
                    }]
                }
            ]
        }
    }
]