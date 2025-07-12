import React, {useEffect, useRef, useState} from "react";
import {Box, Button, FormControlLabel, Grid, MenuItem, Paper, Switch, TextField, Typography,} from "@mui/material";
import CustomSnackbar from "../Snackbar/CustomSnackbar";

const FormComponent = ({title, initialState, fields, onSubmit, onFormChange}) => {
  const [formData, setFormData] = useState(initialState);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const isFirstRender = useRef(true);

  // Update local state if initialState changes from parent (e.g., reset)
  useEffect(() => {
    setFormData(initialState);
  }, [initialState]);

  // Inform parent of form data changes, but skip on first render
  useEffect(() => {
    if (!isFirstRender.current && onFormChange) {
      onFormChange(formData);
    }
    isFirstRender.current = false;
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isFormValid = () => {
    return fields.every((field) => {
      if (field.required) {
        const value = formData[field.name];
        return value !== "" && value !== undefined && value !== null;
      }
      return true;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onSubmit(formData);
    if (result.success) {
      setSnackbar({
        open: true,
        message: result.message || "Form submitted successfully!",
        severity: "success",
      });
      setFormData(initialState); // Reset form
    } else {
      setSnackbar({
        open: true,
        message: result.message || "Something went wrong!",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          p: 3,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 3,
            textAlign: "left",
          }}
        >
          {title}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {fields.map((field) => (
              <Grid key={field.name} item size={{ xs: 12, sm: 6, md: 4 }}>
                {field.type === "select" ? (
                  <TextField
                    select
                    fullWidth
                    required={field.required}
                    label={field.label}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                  >
                    {field.options.map((option) => {
                      const label =
                          typeof option === "object" ? option.label : option;
                      const value =
                          typeof option === "object" ? option.value : option;
                      return (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                      );
                    })}
                  </TextField>
                ) : field.type === "switch" ? (
                  <FormControlLabel
                    key={field.name}
                    name={field.name}
                    sx={{
                      display: "flex",
                      alignItems: "center", 
                      margin: 0,
                    }}
                    control={
                      <Switch
                        checked={formData[field.name]}
                        onChange={handleChange}
                      />
                    }
                    label={field.label}
                  />
                ) : (
                  <TextField
                    fullWidth
                    required={field.required}
                    label={field.label}
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                  />
                )}
              </Grid>
            ))}
            <Grid item size={{ xs: 12 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!isFormValid()}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
};

export default FormComponent;
