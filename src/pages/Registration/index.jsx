import React from "react";
import { Box } from "@mui/material";
import AddDevotee from "../../components/AddDevotee";

const Registration = () => {
  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 2, sm: 3 },
        py: { xs: 1, sm: 2 },
      }}
    >
      <Box
        sx={{
          mt: { xs: 2, sm: 3 },
        }}
      >
        <AddDevotee />
      </Box>
    </Box>
  );
};

export default Registration;
