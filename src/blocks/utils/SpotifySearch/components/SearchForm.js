import React, { useState, useEffect, useCallback } from 'react';
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import { Search, Send } from 'react-feather';
import { debounce } from '@mui/material';

const useStyles = makeStyles({
  field: {
    [`& fieldset`]: {
      borderRadius: 0,
      border: 'none',
    },
    '& .MuiInputBase-input': {
      color: 'white',
    },
    '& .MuiInputBase-input::placeholder': {
      color: 'white',
      opacity: 0.5,
    },
  },
});

const SearchForm = (props) => {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const debouncedSearch = useCallback(
    debounce((term) => {
      if (term.trim().length >= 3) {
        setErrorMsg('');
        props.handleSearch(term);
      }
    }, 500),
    [] // Ensures the debounced function is created only once and not recreated with each render
  );

  useEffect(() => {
    if (searchTerm.trim().length >= 3) {
      debouncedSearch(searchTerm);
    }
  }, [searchTerm, debouncedSearch]);

  const handleInputChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    if (newSearchTerm.trim().length < 3) {
      setErrorMsg('Please enter at least 3 characters.');
    } else {
      setErrorMsg('');
    }
  };

  return (
    <>
      {/* {errorMsg && <h3 className="text-seam-blue bg-seam-green">{errorMsg}</h3>} */}
      <Box className="w-auto" style={{ display: "flex", flexDirection: "row", fontFamily: "Unbounded", justifyContent: 'center', alignItems: 'center', paddingInline: '16px' }}>
        <Search size={24} color={"white"} className="justify-self-center align-self-center" />
        <TextField
          type="search"
          name="searchTerm"
          fullWidth
          value={searchTerm}
          onChange={handleInputChange}
          autoComplete="off"
          className={`mr-2 text-seam-white ${classes.field}`}
          sx={{ width: 'auto', input: { fontSize: '24px', border: 'none', fontFamily: "Public Sans", textTransform: 'none', } }}
        />
      </Box>
    </>
  );
};

export default SearchForm;
