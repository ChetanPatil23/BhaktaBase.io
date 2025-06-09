import * as React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";

const CenterDevoteeTable = ({ rows, title = "", columns }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState(rows);

  // Handle search input change
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    const query = value.toLowerCase();
    const filtered = rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(query)
      )
    );
    setFilteredRows(filtered);
  };

  return (
    <Box sx={{ height: 450, width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: "bold",
            textAlign: { xs: "left", sm: "inherit" },
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          {title ? title : `Devotees (${filteredRows.length})`}
        </Typography>

        <TextField
          variant="outlined"
          size="small"
          placeholder="Search Devotee..."
          value={searchQuery}
          onChange={handleSearch}
          sx={{
            width: { xs: "100%", sm: "300px" },
            maxWidth: "300px",
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "lightgray",
                borderWidth: "1px",
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "lightgray",
            },
            "& .Mui-focused": {
              borderColor: "lightgray",
              borderWidth: "1px",
            },
          }}
        />
      </Box>

      <DataGrid
        rows={filteredRows}
        columns={columns}
        pageSize={8}
        rowsPerPageOptions={[8]}
        checkboxSelection={false}
        disableRowSelectionOnClick
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5",
            fontWeight: "bold",
          },
          width: "100%",
        }}
      />
    </Box>
  );
};

export default CenterDevoteeTable;
