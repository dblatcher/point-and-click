import { Box, IconButton } from "@mui/material"
import { StringInput } from "../SchemaForm/StringInput"
import { ClearIcon, SearchIcon } from "./material-icons"
import { Dispatch, SetStateAction } from "react";

interface Props {
    searchInput: string;
    setSearchInput: Dispatch<SetStateAction<string>>
}

export const SearchControl = ({ searchInput, setSearchInput }: Props) => {
    return <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>
        <SearchIcon />
        <StringInput notFullWidth label="search" value={searchInput} inputHandler={setSearchInput} />
        <IconButton color="primary" title="clear search" onClick={() => setSearchInput('')} ><ClearIcon /></IconButton>
    </Box>
}