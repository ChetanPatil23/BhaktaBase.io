import React from "react";
import { Paper, Stack, Typography, Box, Avatar } from "@mui/material";
import getBadge from "./Badge";

const CenterLeaderBoard = ({ rows, title = "" }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, pt: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ marginBottom: 2, fontWeight: "bold", color: "#36454F" }}
      >
        {title ? title : "Chanting Champions"}
      </Typography>

      <Stack spacing={2}>
        {rows?.map(({ name, mentor, rank }) => (
          <Box
            key={rank}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              borderBottom: "1px solid #e0e0e0",
              pb: 1,
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar>{rank}</Avatar>
              <Box>
                <Typography fontWeight="bold">{name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Mentor: {mentor}
                </Typography>
              </Box>
            </Box>
            {getBadge(rank)}
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

export default CenterLeaderBoard;
