/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h, Component } from "preact"
import { ActOrder, MoveOrder, Order, OrderType, orderTypes, stepSchama, TalkOrder } from "../../../definitions/Order";
import { SelectInput } from "../formControls";
import { getDefaultOrder, makeNewStep } from "../defaults";
import { ListEditor } from "../ListEditor";
import { FieldDef, SchemaForm } from "../SchemaForm";
import { ActorData, SpriteData } from "src";
import { Sprite } from "../../../lib/Sprite";

interface Props {
    data: Order;
    actorData?: ActorData;
    spriteData?: SpriteData;
    updateData: { (data: Order): void };
}

export class OrderForm extends Component<Props> {
    constructor(props: Props) {
        super(props)
        this.changeStep = this.changeStep.bind(this)
        this.changeValue = this.changeValue.bind(this)
    }

    changeValue(propery: keyof Order, newValue: string | undefined | Order['steps']) {
        const { data, updateData } = this.props
        switch (propery) {
            case 'type': {
                if (orderTypes.includes(newValue as OrderType)) {
                    updateData(getDefaultOrder(newValue as OrderType))
                }
                break;
            }
            case 'steps': {
                if (data.type === 'talk') {
                    updateData({
                        type: data.type,
                        steps: newValue as (TalkOrder['steps'])
                    })
                }
                if (data.type === 'act') {
                    updateData({
                        type: data.type,
                        steps: newValue as (ActOrder['steps'])
                    })
                }
                if (data.type === 'move') {
                    updateData({
                        type: data.type,
                        steps: newValue as (MoveOrder['steps'])
                    })
                }
                break;
            }
        }
    }

    changeStep(value: string | number | boolean | undefined, field: FieldDef, index: number) {
        const { data } = this.props
        if (!data.steps[index]) {
            return
        }

        const stepCopy: Record<string, unknown> = Object.assign({}, data.steps[index])
        stepCopy[field.key] = value
        const result = stepSchama[data.type].safeParse(stepCopy)
        if (!result.success) { return }
        const stepListCopy = [...data.steps]
        stepListCopy.splice(index, 1, result.data)
        this.changeValue('steps', stepListCopy as Order['steps'])
    }

    get animationSuggestions(): string[] | undefined {
        const { spriteData } = this.props
        if (!spriteData) {
            return undefined
        }

        const spriteAnimations = Object.keys(spriteData.animations)
        const defaultAnimations = Object.values(Sprite.DEFAULT_ANIMATION).filter(value => !spriteAnimations.includes(value))
        return [...spriteAnimations, ...defaultAnimations]
    }

    render() {
        const { type, steps } = this.props.data
        const { animationSuggestions, changeStep, changeValue } = this

        return (
            <article style={{ flex: 1 }}>

                <div style={{ borderBottom: '3px double black' }}>
                    <SelectInput label="order type"
                        value={type}
                        items={orderTypes}
                        onSelect={newValue => changeValue('type', newValue)}
                    />
                </div>

                {type === 'talk' && (
                    <ListEditor
                        list={steps}
                        describeItem={(step, index) => (
                            <SchemaForm key={index}
                                changeValue={(value, field) => { changeStep(value, field, index) }}
                                data={step}
                                suggestions={{ animation: animationSuggestions }}
                                schema={stepSchama[type]} />
                        )}
                        mutateList={(newList) => changeValue('steps', newList)}
                        createItem={makeNewStep[type]}
                    />
                )}
                {type === 'act' && (
                    <ListEditor
                        list={steps}
                        describeItem={(step, index) => (
                            <SchemaForm key={index}
                                changeValue={(value, field) => { changeStep(value, field, index) }}
                                data={step}
                                suggestions={{ animation: animationSuggestions }}
                                schema={stepSchama[type]} />
                        )}
                        mutateList={(newList) => changeValue('steps', newList)}
                        createItem={makeNewStep[type]}
                    />
                )}
                {type === 'move' && (
                    <ListEditor
                        list={steps}
                        describeItem={(step, index) => (
                            <SchemaForm key={index}
                                changeValue={(value, field) => { changeStep(value, field, index) }}
                                data={step}
                                suggestions={{ animation: animationSuggestions }}
                                schema={stepSchama[type]} />
                        )}
                        mutateList={(newList) => changeValue('steps', newList)}
                        createItem={makeNewStep[type]}
                    />
                )}
            </article>
        )
    }
}