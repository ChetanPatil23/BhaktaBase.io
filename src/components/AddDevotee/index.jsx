import React from "react";
import FormComponent from "../FormComponent";
import { validatePhoneNumber } from "../../utils";
import { getFormFields } from "../../constants/formFieldsConfig";

const AddDevotee = () => {
  const initialState = {
    devoteeName: "",
    level: "",
    mentorName: "",
    phone: "",
    center: "",
    rounds: "",
    isDevotee: false,
  };

  const fields = getFormFields(initialState);

  const handleSubmit = (formData) => {
    if (!validatePhoneNumber(formData.phone)) {
      return {
        success: false,
        message: "Invalid phone number! It must have 10 digits.",
      };
    }
    console.log("Submitted Devotee:", formData);
    return { success: true, message: "Devotee registered successfully!" };
  };

  return (
    <FormComponent
      title="Register Member"
      initialState={initialState}
      fields={fields}
      onSubmit={handleSubmit}
    />
  );
};

export default AddDevotee;
