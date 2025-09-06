import { OptionalNumberInput } from "@/components/SchemaForm/OptionalNumberInput";
import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { ImageAsset, imageAssetCategories, ImageAssetCategory } from "@/services/assets";
import { Stack } from "@mui/material";

interface Props {
    asset: Partial<ImageAsset>;
    changeValue: { (mod: Partial<ImageAsset>): void }
}


export const ImageAssetForm = ({ asset: imageAsset, changeValue }: Props) => {
    return (
        <Stack spacing={2}>
            <SelectInput optional
                value={imageAsset.category}
                label="category"
                inputHandler={(value) => { changeValue({ 'category': value as ImageAssetCategory }) }}
                options={imageAssetCategories}
            />
            <Stack direction={'row'}>
                <OptionalNumberInput
                    value={imageAsset.rows}
                    label="rows"
                    inputHandler={(rows) => { changeValue({ rows }) }}
                    min={1}
                />
                <OptionalNumberInput
                    value={imageAsset.cols}
                    label="cols"
                    inputHandler={(cols) => { changeValue({ cols }) }}
                    min={1}
                />
            </Stack>
            <Stack direction={'row'}>
                <OptionalNumberInput
                    value={imageAsset.widthScale}
                    label="widthScale"
                    inputHandler={(widthScale) => { changeValue({ widthScale }) }}
                    step={.1}
                />
                <OptionalNumberInput
                    value={imageAsset.heightScale}
                    label="heightScale"
                    inputHandler={(heightScale) => { changeValue({ heightScale }) }}
                    step={.1}
                />
            </Stack>
        </Stack>
    )
}