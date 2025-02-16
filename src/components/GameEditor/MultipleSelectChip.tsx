import { findById } from '@/lib/util';
import { SxProps, Theme, useTheme, Tooltip, Typography, Box, Chip, FormControl, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';

type OptionForChip = { label?: string, id: string, description?: string }

interface Props {
  label: string
  options: OptionForChip[]
  selectedOptionIds: string[]
  setSelectedOptionIds: { (selectedOptionIds: string[]): void }
  idBase: string
  sx?: SxProps
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 2;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightBold
      : theme.typography.fontWeightRegular,
  };
}


export const MultipleSelectChip = ({ options, label, selectedOptionIds, setSelectedOptionIds, idBase, sx }: Props) => {
  const theme = useTheme();

  const idPrefix = `${idBase}-chip-select`

  const handleChange = (event: SelectChangeEvent<typeof selectedOptionIds>) => {
    const {
      target: { value },
    } = event;
    setSelectedOptionIds(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const OptionChip = ({ optionId }: { optionId: string }) => {
    const matchingOption = findById(optionId, options);
    if (!matchingOption) {
      return null
    }
    const label = matchingOption.label ?? matchingOption.id;
    if (matchingOption.description) {
      return <Tooltip title={matchingOption.description}>
        <Chip label={label} />
      </Tooltip>
    }

    return <Chip label={label} />
  }

  return (
    <FormControl sx={sx}>
      <Typography component={'label'} variant='subtitle2' display={'block'} id={`${idPrefix}-label`}>{label}</Typography>
      <Select
        disabled={options.length === 0}
        labelId={`${idPrefix}-label`}
        id={idPrefix}
        multiple
        sx={{ minHeight: 40 }}
        value={selectedOptionIds}
        onChange={handleChange}
        input={<OutlinedInput id={`${idPrefix}-internal-input`} label={label} inputProps={{ sx: { paddingY: 0 } }} />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, paddingTop: 1, }}>
            {selected.map((optionId) => <OptionChip key={optionId} optionId={optionId} />)}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {options.map((option) => (
          <MenuItem
            key={option.id}
            value={option.id}
            style={getStyles(option.id, selectedOptionIds, theme)}
          >
            {option.label ?? option.id}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}