import React, {useEffect, useState} from "react";
import FormComponent from "../FormComponent";
import {validatePhoneNumber} from "../../utils";
import {getFormFields} from "../../constants/formFieldsConfig";
import {fetchFromApi} from "../../constants/apiconfig.js";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";

const AddDevotee = () => {
  const [centerOptions, setCenterOptions] = useState([]);
  const [mentorOptions, setMentorOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [newBatchName, setNewBatchName] = useState("");
  const [openBatchDialog, setOpenBatchDialog] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    devoteeName: "",
    level: "",
    mentorName: "",
    phone: "",
    center: "",
    batch: "",
    rounds: "",
    isDevotee: false,
    pgLocation: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [centersJson, mentorsJson] = await Promise.all([
          fetchFromApi("/center"),
          fetchFromApi("/user?role=Devotee"),
        ]);

        // Fixed: Transform API data to match select field format
        setCenterOptions(
            centersJson.map((c) => ({
              label: c.name,
              value: c._id,
            }))
        );

        setMentorOptions(
            mentorsJson.users.map((m) => ({
              label: m.name,
              value: m._id,
            }))
        );
      } catch (err) {
        console.error("Failed to fetch centers or mentors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchBatches = async () => {
      if (!formData.center) {
        setBatchOptions([]);
        return;
      }

      try {
        const batchesJson = await fetchFromApi(`/batch?center=${formData.center}`);

        setBatchOptions(
            batchesJson.map((batch) => ({
              label: `${batch.name} (Level ${batch.currentLevel})`,
              value: batch._id,
            }))
        );
      } catch (err) {
        console.error("Failed to fetch batches:", err);
        setBatchOptions([]);
      }
    };

    fetchBatches();
  }, [formData.center, centerOptions]); // Added centerOptions as dependency

  const handleFormChange = (newFormData) => {
    setFormData((prevFormData) => {
      // If center has changed, reset the batch
      if (newFormData.center !== prevFormData.center) {
        return {
          ...newFormData,
          batch: "",  // Clear batch when center changes
        };
      }

      // If batch selected is "+ Add New Batch", do not update here, that’s handled elsewhere
      if (newFormData.batch === "__add_new__") {
        return prevFormData; // Prevent form update for add-new trigger
      }

      return newFormData;
    });
  };

  const fields = getFormFields(formData, centerOptions, mentorOptions, batchOptions);
  const handleAddBatch = async () => {
    if (!newBatchName.trim() || !formData.center) return;

    try {
      const response = await fetchFromApi("/batch", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          name: newBatchName,
          center: formData.center,
          currentLevel: currentLevel,
        }),
      });

      const newBatchOption = {
        label: response.name,
        value: response._id,
      };

      setBatchOptions((prev) => [...prev, newBatchOption]);
      setFormData((prev) => ({...prev, batch: response._id}));
      setNewBatchName("");
      setCurrentLevel(1);
      setOpenBatchDialog(false);
      setSnackbar({
        open: true,
        message: "Batch added successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error adding batch:", error);
      setSnackbar({
        open: true,
        message: "Failed to add batch. Please try again.",
        severity: "error",
      });
    }
  };


  const handleSubmit = async (formData) => {
    if (!validatePhoneNumber(formData.phone)) {
      return {
        success: false,
        message: "Invalid phone number! It must have 10 digits.",
      };
    }

    if (!formData.devoteeName || !formData.center || !formData.batch) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      };
    }

    const payload = {
      name: formData.devoteeName,
      contact: formData.phone,
      center: formData.center,
      batch: formData.batch,
      Role: formData.isDevotee ? "Devotee" : "Participant",
      chantingRounds: parseInt(formData.rounds, 10),
      mentorId: formData.isDevotee ? null : formData.mentorName,
      pgLocation: formData.pgLocation,
    };

    setSubmitting(true);

    try {
      const response = await fetchFromApi("/user/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("User created successfully:", response);

      setFormData({
        devoteeName: "",
        level: "",
        mentorName: "",
        phone: "",
        center: "",
        batch: "",
        rounds: "",
        isDevotee: false,
        pgLocation: "",
      });

      return {
        success: true,
        message: "Member registered successfully!"
      };

    } catch (error) {
      console.error("Error creating user:", error);

      let errorMessage = "Failed to register member. Please try again.";
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.error === 'DUPLICATE_KEY_ERROR') {
          errorMessage = errorData.message || "A member with this contact number already exists.";
        } else if (errorData.error === 'VALIDATION_ERROR') {
          const validationMessages = errorData.details?.map(detail =>
              `${detail.field}: ${detail.message}`
          ).join(', ') || 'Please check your inputs.';
          errorMessage = `Validation failed: ${validationMessages}`;
        } else if (errorData.error === 'CAST_ERROR') {
          errorMessage = errorData.message || "Invalid data format provided.";
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid data provided. Please check your inputs.";
      } else if (error.response?.status === 409) {
        errorMessage = "A member with this phone number already exists.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error occurred. Please try again later.";
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        errorMessage = "Network error. Please check your connection and try again.";
      }

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
      <>
        <Dialog open={openBatchDialog} onClose={() => setOpenBatchDialog(false)}>
          <DialogTitle>Add New Batch</DialogTitle>
          <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="Batch Name"
                fullWidth
                value={newBatchName}
                onChange={(e) => setNewBatchName(e.target.value)}
            />
            <TextField
                margin="dense"
                label="Current Level"
                fullWidth
                type="number"
                inputProps={{min: 1}}
                value={currentLevel}
                onChange={(e) => setCurrentLevel(Number(e.target.value))}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBatchDialog(false)}>Cancel</Button>
            <Button onClick={handleAddBatch}>Add</Button>
          </DialogActions>
        </Dialog>


        <FormComponent
            title="Register Member"
            initialState={formData}
            fields={fields}
            onSubmit={handleSubmit}
            onFormChange={handleFormChange}
            onAddNewBatch={() => setOpenBatchDialog(true)}
            snackbar={snackbar}
            setSnackbar={setSnackbar}
        />
      </>
  );
};

export default AddDevotee;
