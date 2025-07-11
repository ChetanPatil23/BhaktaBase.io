import React from "react";
import { Paper, Stack, Typography, Box, Avatar } from "@mui/material";
import { PureComponent } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const COLORS = ["#0088FE", "#00C49F", "#2E8B57"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, uv } = payload[0].payload; 
    return (
      <div className="custom-tooltip" style={{ background: "#fff", padding: "10px", border: "1px solid #ccc" }}>
        <p>{`Round: <=${name}`}</p>
        <p>{`Devotees: ${uv}`}</p>
      </div>
    );
  }

  return null;
};

export const ChantingRounds = ({ title, rows = [] }) => {
  console.log(rows, "ChantingRounds");
  return (
    <Paper elevation={3} sx={{ p: 3, pt: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ marginBottom: 2, fontWeight: "bold", color: "#36454F" }}
      >
        {title ? title : "Chanting Rounds Distribution"}
      </Typography>
      <ResponsiveContainer width={"100%"} height={190}>
      <BarChart
        data={rows}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="xname" />
        <YAxis allowDecimals={false}  ticks={[0, 1, 2, 4, 8]}/>
        <Tooltip content={<CustomTooltip />} /> {/* Use custom tooltip */}
        <Bar dataKey="uv" fill="#3944bc" />
      </BarChart>
    </ResponsiveContainer>
    </Paper>
  );
};
