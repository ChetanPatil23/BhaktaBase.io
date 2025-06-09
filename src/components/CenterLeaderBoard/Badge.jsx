import React from "react";
import { Chip } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const getBadge = (rank) => {
  switch (rank) {
    case 1:
      return (
        <Chip
          icon={<EmojiEventsIcon sx={{ color: "#FFD700" }} />}
          label="Gold"
          sx={{ backgroundColor: "#FFF8DC", color: "#000" }}
        />
      );
    case 2:
      return (
        <Chip
          icon={<EmojiEventsIcon sx={{ color: "#C0C0C0" }} />}
          label="Silver"
          sx={{ backgroundColor: "#F0F0F0", color: "#000" }}
        />
      );
    case 3:
      return (
        <Chip
          icon={<EmojiEventsIcon sx={{ color: "#CD7F32" }} />}
          label="Bronze"
          sx={{ backgroundColor: "#F5DEB3", color: "#000" }}
        />
      );
    default:
      return null;
  }
};

export default getBadge;