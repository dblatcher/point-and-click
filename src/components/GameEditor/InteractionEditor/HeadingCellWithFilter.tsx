import { Box, IconButton, TableCell } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Theme, useTheme } from '@mui/material/styles';
import { Dispatch, ReactNode, SetStateAction } from "react";
import { FilterListIcon, FilterListOffIcon } from '../material-icons';

interface Props {
    label: string,
    list: string[],
    setList: Dispatch<SetStateAction<string[]>>
    options: string[]
    descriptions?: ReactNode[]
}

const ITEM_HEIGHT = 30;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        },
    },
};


function getStyles(id: string, list: string[], theme: Theme) {
    return {
        fontWeight: list.includes(id)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}

export const HeadingCellWithFilter = ({ label, list, setList, options, descriptions }: Props) => {
    const theme = useTheme();

    const handleChange = (event: SelectChangeEvent<typeof list>) => {
        const { target: { value } } = event;
        setList(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (

        <TableCell>
            <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                <span>{label}</span>
                <IconButton color='secondary'
                    title='clear filter'
                    disabled={list.length === 0}
                    onClick={() => setList([])}>
                    <FilterListOffIcon />
                </IconButton>
            </Box>
            <Box display={'flex'} alignItems={'center'}>
                <FormControl sx={{ width: 180, paddingY: 1 }} title={list.join("; ")}>
                    <InputLabel id={`table-filter-${label}-label`}>filter</InputLabel>
                    <Select
                        labelId={`table-filter-${label}-label`}
                        id={`table-filter-${label}`}
                        multiple
                        value={list}
                        onChange={handleChange}
                        input={<OutlinedInput color='secondary' label={`${label} filter`} size='small' />}
                        MenuProps={MenuProps}
                        IconComponent={FilterListIcon}
                    >
                        {options.map((id, index) => (
                            <MenuItem
                                key={index}
                                value={id}
                                sx={{ fontSize: 'small' }}
                                style={getStyles(id, list, theme)}
                            >
                                {descriptions?.[index] ?? id}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

            </Box>
        </TableCell>
    );
}
