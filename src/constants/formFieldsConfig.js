import {levels, rounds} from ".";

export const getFormFields = (formData, centerOptions = [], mentorOptions = [], batchOptions = []) => [
    {
        label: "Member Name",
        name: "devoteeName",
        type: "text",
        required: true,
    },
    {
        label: "Phone Number",
        name: "phone",
        type: "tel",
        required: true,
    },
    {
        label: "FOE Level",
        name: "level",
        type: "select",
        options: levels,
        required: true,
    },
    {
        label: "Chanting Rounds",
        name: "rounds",
        type: "select",
        options: rounds,
        required: true,
    },
    {
        label: "Bhakti Center",
        name: "center",
        type: "select",
        options: centerOptions,
        required: true,
    },
    {
        label: "Batch",
        name: "batch",
        type: "select",
        options: batchOptions,
        required: true,
        disabled: !formData.center, // Disable if no center selected
        placeholder: formData.center ? "Select a batch" : "Please select a center first",
    },
    {
        label: "Mentor Name",
        name: "mentorName",
        type: "select",
        options: mentorOptions,
        required: !formData.isDevotee,
    },
    {
        label: "PG/Flat Location",
        name: "pgLocation",
        type: "text",
        required: true,
    },
    {
        label: "Is Devotee",
        name: "isDevotee",
        type: "switch",
        required: false,
    },
];
