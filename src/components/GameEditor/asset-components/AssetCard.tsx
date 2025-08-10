import { FileAsset, isSoundAsset } from "@/services/assets";
import { TextConceptCard } from "../ConceptCard";
import { AudioFileOutlinedIcon, PhotoOutlinedIcon } from "@/components/GameEditor/material-icons"

interface Props {
    asset: FileAsset
    handleClick: { (): void }
}

export const AssetCard = ({ asset, handleClick }: Props) => {

    const isSound = isSoundAsset(asset)

    const Icon = isSound
        ? AudioFileOutlinedIcon
        : PhotoOutlinedIcon

    const title = isSound
        ? 'sound'
        : 'image'

    return <TextConceptCard
        title={title}
        text={`${asset.id}: ${asset.category}`}
        Icon={Icon}
        handleClick={handleClick}
    />

}