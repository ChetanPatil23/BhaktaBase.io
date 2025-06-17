import * as React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";

const CenterDevoteeTable = ({ rows, title = "", columns }) => {
  const rowsWithIds = rows?.map((row, index) => ({
    ...row,
    id: row._id || index,
  }));
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState(rowsWithIds);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const styles = isMobile
    ? {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "140px",
        marginRight: "10px",
      }
    : {}; // Apply no styles for larger screens

  React.useEffect(() => {
    setFilteredRows(rowsWithIds);
  }, [rows]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    const query = value.toLowerCase();
    const filtered = rowsWithIds.filter((row) =>
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
            ...styles,
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
