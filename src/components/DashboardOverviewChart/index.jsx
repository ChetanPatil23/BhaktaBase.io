import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import { Paper, Typography } from "@mui/material";

const data = [
  {
    center: "Panathur",
    devotees: 45,
    rounds: 150,
  },
  {
    center: "Whitefield",
    devotees: 79,
    rounds: 110,
  },
  {
    center: "AECS",
    devotees: 65,
    rounds: 380,
  },
];


const DashboardOverviewChart = () => {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#36454F" }}
      >
        Bhakti Centers
      </Typography>
      <ResponsiveContainer width="100%" height={208}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <XAxis dataKey="center" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="devotees" fill="#50E3C2" name="Total Devotees" />
          <Bar dataKey="rounds" fill="#3944BC" name="Total Rounds Chanted" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default DashboardOverviewChart;
