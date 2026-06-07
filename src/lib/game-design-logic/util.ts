import { Interaction } from "point-click-lib";

export const describeInteraction = (interaction: Interaction) => {
    const { verbId, targetId, itemId } = interaction;
    return itemId
        ? `${verbId} ${targetId} with ${itemId}`
        : `${verbId} ${targetId}`
}