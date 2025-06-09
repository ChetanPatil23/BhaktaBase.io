import React from "react";
import {
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
} from "@mui/icons-material";

const ContactIcons = ({ params }) => {
  return (
    <>
      <PhoneIcon
        sx={{
          color: "#1976D2",
          cursor: "pointer",
          marginRight: "8px",
          "&:hover": {
            color: "#115293",
          },
          fontSize: "1rem",
        }}
        onClick={() => window.open(`tel:${params.value}`, "_self")}
      />
      <WhatsAppIcon
        sx={{
          color: "#25D366",
          cursor: "pointer",
          marginRight: "8px",
          "&:hover": {
            color: "#128C7E",
          },
          fontSize: "1rem",
        }}
        onClick={() => {
          window.open(`https://wa.me/${params.value}`, "_blank");
        }}
      />
    </>
  );
};

export default ContactIcons;
