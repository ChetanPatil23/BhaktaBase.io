import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Button,
  MenuItem,
  Grid,
} from "@mui/material";
import { rows } from "../../mockData";
import { levels } from "../../constants";

const DevoteeAsyncAutocomplete = ({ setSnackbarOpen }) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [session, setSession] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (inputValue.length >= 2) {
        setLoading(true);
        setTimeout(() => {
          setOptions(
            rows
              .filter((row) =>
                row.devoteeName.toLowerCase().includes(inputValue.toLowerCase())
              )
              .map((el) => el.devoteeName)
          );
          setLoading(false);
        }, 1000);

        // Simulate API call (replace this with real fetch)
        // fetch(`https://api.example.com/devotees?search=${inputValue}`)
        //   .then(res => res.json())
        //   .then(data => {
        //     setOptions(data); // Assume data is an array of names
        //     setLoading(false);
        //   });
      } else {
        setOptions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);

  const handleSubmit = () => {
    console.log("Attendance marked for:", selected);
    setSnackbarOpen(true);
    setSelected(null);
    setSession("");
    setInputValue("");
  };

  return (
    <div>
      <Grid
        item
        size={{ xs: 12 }}
        sx={{
          marginBottom: "16px",
          width: "100%",
        }}
      >
        <TextField
          select
          fullWidth
          required={true}
          label={"Choose Session/Batch"}
          name={"Session"}
          value={session}
          onChange={(event) => setSession(event.target.value)}
          sx={{
            width: "100%",
            "& .MuiSelect-select": {
              textAlign: "left",
              // color: theme.palette.text.primary,
            },
          }}
        >
          {levels.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Autocomplete
        freeSolo
        options={options}
        loading={loading}
        inputValue={inputValue}
        onInputChange={(event, newInput) => setInputValue(newInput)}
        value={selected}
        onChange={(event, newValue) => setSelected(newValue)}
        noOptionsText="No results found"
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Devotee"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={!selected}
        onClick={handleSubmit}
        style={{ marginTop: "16px" }}
      >
        Mark Present
      </Button>
    </div>
  );
};

export default DevoteeAsyncAutocomplete;
