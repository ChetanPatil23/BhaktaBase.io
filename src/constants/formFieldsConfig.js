import { bhaktiCenters, levels, rounds } from ".";

export const getFormFields = (formData) => [
    {
      label: "Member Name",
      name: "devoteeName",
      type: "text",
      value: formData.devoteeName,
      required: true,
    },
    {
      label: "Mentor Name",
      name: "mentorName",
      type: "text",
      value: formData.mentorName,
      required: true,
    },
    {
      label: "Phone Number",
      name: "phone",
      type: "tel",
      value: formData.phone,
      required: true,
    },
    {
      label: "FOE Level",
      name: "level",
      type: "select",
      value: formData.level,
      options: levels,
      required: true,
    },
    {
      label: "Chanting Rounds",
      name: "rounds",
      type: "select",
      value: formData.rounds,
      options: rounds,
      required: true,
    },
    {
      label: "Bhakti Center",
      name: "center",
      type: "select",
      value: formData.center,
      options: bhaktiCenters,
      required: true,
    },
    {
      label: "PG/Flat Location",
      name: "pgLocation",
      type: "text",
      value: formData.pgAddress,
    //   options: bhaktiCenters,
      required: true,
    },
    {
      label: "Is Devotee",
      name: "isDevotee",
      type: "switch",
      value: formData.isDevotee,
      required: false,
    },
  ];
