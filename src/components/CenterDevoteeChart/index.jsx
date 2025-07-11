import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

const COLORS = ["#0088FE", "#00C49F", "#2E8B57"];

const CenterDevoteeChart = ({rows} ) => {
  const foeLevelCounts = rows.reduce((acc, d) => {
    acc[d.foeLevel] = (acc[d.foeLevel] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(foeLevelCounts).map(([level, count]) => ({
    name: level,
    value: count,
  }))
  const totalDevotees = rows.length;

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
    index
  }) => {
    const radius = outerRadius + 10;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill={COLORS[index % COLORS.length]} 
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        transform={`rotate(-0, ${x}, ${y})`}
        style={{ fontSize: "12px", fontWeight: "bold" }}
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <Card sx={{ width: "100%" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#36454F",
            }}
          >
            FOE Level Distribution
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Total Devotees: {totalDevotees}
          </Typography>
        </Box>
        <ResponsiveContainer
          width="100%"
          height={190}
        >
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(props) => renderCustomLabel({ ...props, index: props.index })}
              outerRadius={65}
              dataKey="value"
            >
              {pieData.map((_, index) => (
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
      </CardContent>
    </Card>
  );
};

export default CenterDevoteeChart;
