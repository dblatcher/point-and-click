import { Component } from "react";
import { AnyConsequence, Consequence, GameDesign, Order, Sequence, Stage, ImmediateConsequence } from "@/definitions";
import { ImmediateConsequenceSchema } from "@/definitions/Consequence";
import { cloneData } from "@/lib/clone";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import { listIds } from "@/lib/util";
import { getDefaultOrder, makeBlankSequence, makeBlankStage, makeNewConsequence } from "../defaults";
import { ConsequenceForm } from "../InteractionEditor/ConsequenceForm";
import { ListEditor } from "../ListEditor";
import { OrderForm } from "../OrderForm";
import { StorageMenu } from "../StorageMenu";
import { SelectAndConfirmInput, StringInput } from "../formControls";
import { TabMenu } from "@/components/GameEditor/TabMenu";
import { DataItemEditorProps } from "../dataEditors";
import { getTargetLists } from "../InteractionEditor/getTargetLists";
import { EditorHeading } from "../EditorHeading";
import { Accordion, AccordionDetails, AccordionSummary, Typography, Stack } from "@mui/material";
import { EditorBox } from "../EditorBox";


type Props = DataItemEditorProps<Sequence> & {
    gameDesign: GameDesign;
    sequenceId?: string;
    isSubSection?: boolean;
}

type ExtraState = {

}
type State = Sequence & ExtraState



export class SequenceEditor extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = this.initialState
        this.changeOrder = this.changeOrder.bind(this)
        this.changeOrderList = this.changeOrderList.bind(this)
        this.changeConsequence = this.changeConsequence.bind(this)
        this.changeConsequenceList = this.changeConsequenceList.bind(this)
        this.renderStage = this.renderStage.bind(this)
        this.setStateWithAutosave = this.setStateWithAutosave.bind(this)
    }

    get initialState(): Sequence {
        const { data } = this.props
        return data ? {
            ...cloneData(data)
        } : makeBlankSequence()
    }

    get currentData(): Sequence {
        const actorData = cloneData(this.state) as State;
        return actorData
    }

    setStateWithAutosave(input: Partial<State> | { (state: State): Partial<State> }) {
        const { options, data, updateData, gameDesign } = this.props

        if (!options.autoSave) {
            return this.setState(input)
        }

        return this.setState(input, () => {
            const isExistingId = listIds(gameDesign.sequences).includes(this.state.id)
            if (data && isExistingId) {
                updateData(this.currentData)
            }
        })
    }

    changeOrder(order: Order, stageIndex: number, actorId: string, orderIndex: number) {
        this.setStateWithAutosave(state => {
            const { stages } = state
            const actorOrders = stages[stageIndex]?.actorOrders
            if (!actorOrders) { return {} }
            const ordersForActor = actorOrders[actorId]
            if (!ordersForActor) { return {} }
            ordersForActor.splice(orderIndex, 1, order)
            return { stages }
        })
    }

    changeOrderList(newList: Order[], stageIndex: number, actorId: string) {
        this.setStateWithAutosave(state => {
            const { stages } = state
            const stage = stages[stageIndex]
            if (!stage) { return {} }
            if (!stage.actorOrders) { stage.actorOrders = {} }
            stage.actorOrders[actorId] = newList
            return { stages }
        })
    }

    changeConsequence(consequence: Consequence, stageIndex: number, consequenceIndex: number) {
        const isImmediateConsequence = ImmediateConsequenceSchema.safeParse(consequence)
        if (!isImmediateConsequence.success) {
            console.warn('not immediate', consequence)
            return
        }

        this.setStateWithAutosave(state => {
            const { stages } = state
            const immediateConsequences = stages[stageIndex]?.immediateConsequences
            if (!immediateConsequences) { return {} }
            immediateConsequences.splice(consequenceIndex, 1, isImmediateConsequence.data)
            return { stages }
        })
    }

    changeConsequenceList(newList: ImmediateConsequence[], stageIndex: number) {
        this.setStateWithAutosave(state => {
            const { stages } = state
            const stage = stages[stageIndex]
            if (!stage) { return {} }
            stage.immediateConsequences = newList
            return { stages }
        })
    }

    renderActorOrderList(actorId: string, orders: Order[], stageIndex: number) {
        const { gameDesign } = this.props
        const { ids: targetIds, descriptions } = getTargetLists(gameDesign, true)

        return (
            <ListEditor
                list={orders}
                describeItem={(order, orderIndex) => (
                    <OrderForm key={orderIndex}
                        data={order}
                        targetIdOptions={targetIds}
                        targetIdDescriptions={descriptions}
                        animationSuggestions={getStatusSuggestions(actorId, gameDesign)}
                        updateData={(newOrder) => { this.changeOrder(newOrder, stageIndex, actorId, orderIndex) }}
                    />
                )}
                mutateList={newList => { this.changeOrderList(newList, stageIndex, actorId) }}
                createItem={() => getDefaultOrder('act')}
                insertText="insert order"
                deleteText="remove order"
            />
        )
    }

    renderStage(stage: Stage, stageIndex: number) {
        const { gameDesign } = this.props
        const { immediateConsequences = [], actorOrders = {} } = stage
        const orderCount = Object.values(actorOrders).flat().length
        return (
            <section key={stageIndex} style={{ width: '100%' }}>
                <Accordion disableGutters>
                    <AccordionSummary>
                        <Stack direction={'row'} justifyContent={'space-between'} flex={1}>
                            <Typography>Stage {stageIndex + 1}</Typography>
                            <Typography component={'i'}>{orderCount} orders, {immediateConsequences.length} consequences</Typography>
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                        <SelectAndConfirmInput
                            label="add orders for:"
                            items={listIds(gameDesign.actors).filter(id => !Object.keys(actorOrders).includes(id))}
                            onSelect={value => { this.changeOrderList([getDefaultOrder('say')], stageIndex, value) }}
                        />

                        <TabMenu
                            defaultOpenIndex={0}
                            tabs={
                                [
                                    ...Object.entries(actorOrders).map(([actorId, orders]) => ({
                                        content: this.renderActorOrderList(actorId, orders, stageIndex),
                                        label: `${actorId}[${orders.length}]`
                                    })),
                                    {
                                        label: `consequences [${immediateConsequences.length}]`,
                                        content: (
                                            <ListEditor list={immediateConsequences}
                                                mutateList={(newList) => { this.changeConsequenceList(newList, stageIndex) }}
                                                describeItem={(consequence, consequenceIndex) => (
                                                    <ConsequenceForm immediateOnly={true}
                                                        key={consequenceIndex}
                                                        consequence={consequence as AnyConsequence}
                                                        gameDesign={gameDesign}
                                                        update={(consequence) => { this.changeConsequence(consequence, stageIndex, consequenceIndex) }}
                                                    />
                                                )}
                                                createButton="END"
                                                noMoveButtons
                                                createItem={() => makeNewConsequence('changeStatus')}
                                                insertText='add consequence'
                                                deleteText="delete consequence"
                                            />
                                        )
                                    }
                                ]
                            }
                        />
                    </AccordionDetails>
                </Accordion>
            </section>
        )
    }

    render() {
        const { gameDesign, sequenceId, updateData, deleteData, options, isSubSection, data } = this.props
        const { description, stages = [], id } = this.state

        return (
            <article>

                {isSubSection
                    ? (<>
                        <h3>Edit sequence: </h3>
                        <div>ID: <b>{data?.id}</b></div>
                        <StringInput block label="description" value={description || ''}
                            inputHandler={(description) => {
                                this.setStateWithAutosave({ description })
                            }}
                        />
                    </>)
                    : (<>
                        <EditorHeading heading="Sequence Editor" itemId={data?.id ?? '[new]'} />
                        <Stack direction='row' spacing={1}>
                            <EditorBox title="details">
                                <StringInput block label="id" value={id} // don't autosave when changing ID
                                    inputHandler={(id) => { this.setState({ id }) }}
                                />
                                <StringInput block label="description" value={description || ''}
                                    inputHandler={(description) => {
                                        this.setStateWithAutosave({ description })
                                    }}
                                />
                            </EditorBox>

                            <StorageMenu
                                type='sequence'
                                data={this.currentData}
                                originalId={sequenceId}
                                existingIds={listIds(gameDesign.sequences)}
                                reset={() => this.setState(this.initialState)}
                                update={() => { updateData(this.currentData) }}
                                deleteItem={deleteData}
                                options={options}
                            />
                        </Stack>
                    </>)}


                <ListEditor
                    list={stages}
                    describeItem={this.renderStage}
                    mutateList={stages => { this.setStateWithAutosave({ stages }) }}
                    createItem={makeBlankStage}
                    insertText={`INSERT NEW STAGE`}
                    deleteText={`REMOVE STAGE`}
                />
            </article>
        )
    }
}