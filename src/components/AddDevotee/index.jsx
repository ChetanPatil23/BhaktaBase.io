import React, {useEffect, useState} from "react";
import FormComponent from "../FormComponent";
import {validatePhoneNumber} from "../../utils";
import {getFormFields} from "../../constants/formFieldsConfig";
import {fetchFromApi} from "../../constants/apiconfig.js";

const AddDevotee = () => {
  const [centerOptions, setCenterOptions] = useState([]);
  const [mentorOptions, setMentorOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
    if (newFormData.center !== formData.center) {
      newFormData = {...newFormData, batch: ""};
    }
    setFormData(newFormData);
  };

  const fields = getFormFields(formData, centerOptions, mentorOptions, batchOptions);

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
        <FormComponent
            title="Register Member"
            initialState={formData}
            fields={fields}
            onSubmit={handleSubmit}
            onFormChange={handleFormChange}
        />
      </>
  );
};

export default AddDevotee;
