import { downloadJsonFile } from '@/lib/files';
import DownloadIcon from '@mui/icons-material/Download';
import { Button, ButtonProps } from '@mui/material';

interface Props {
    dataItem: { id: string }
    itemTypeName: string
    buttonProps?: ButtonProps
}

export const DownloadJsonButton = ({ dataItem, itemTypeName, buttonProps }: Props) => (
    <Button
        startIcon={<DownloadIcon />}
        onClick={(): void => { downloadJsonFile(dataItem, itemTypeName) }}
        {...buttonProps}
    >Save to file</Button>
)