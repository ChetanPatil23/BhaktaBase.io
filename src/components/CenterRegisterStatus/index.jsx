import React from "react";
import {
  Paper,
  Stack,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


const COLORS = ["#0088FE", "#00C49F", "#2E8B57"];

export const CenterRegisterStatus = ({ title, rows=[] }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, pt: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ marginBottom: 2, fontWeight: "bold", color: "#36454F" }}
      >
        {title ? title : "Registration Status"}
      </Typography>

      <ResponsiveContainer width="100%" height={190}>
        <PieChart>
          <Pie
            data={rows} //pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            //  label={(props) => renderCustomLabel({ ...props, index: props.index })}
            outerRadius={65}
            dataKey="value"
          >
            {rows.map((_, index) => (
                   <Cell
                     key={`cell-${index}`}
                     fill={COLORS[index % COLORS.length]}
                   />
                 ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
};
