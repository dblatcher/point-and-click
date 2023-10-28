import { FileAsset, isSoundAsset } from "@/services/assets";
import { ConceptCard } from "../ConceptCard";
import AudioFileOutlinedIcon from '@mui/icons-material/AudioFileOutlined';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';

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

    return <ConceptCard
        title={title}
        description={`${asset.id}: ${asset.category}`}
        Icon={Icon}
        handleClick={handleClick}
    />

}