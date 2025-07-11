import React, { useState } from "react";
import {
  Paper,
  Typography,
  Snackbar,
  Alert,
  Grid
} from "@mui/material";
import DevoteeAsyncAutocomplete from "../AutoComplete";

export default function AttendanceForm() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  return (
    <Grid item size={{ xs: 12, sm: 8, md: 6, lg: 4 }} sx={{ px: 3, py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mx: "auto", mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Mark Daily Attendance
        </Typography>

    
        <DevoteeAsyncAutocomplete setSnackbarOpen={setSnackbarOpen} />

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            severity="success"
            variant="filled"
            onClose={() => setSnackbarOpen(false)}
          >
            Attendance marked successfully!
          </Alert>
        </Snackbar>
      </Paper>
    </Grid>
  );
}
