import { Grid, Typography } from "@mui/material";
import DashboardOverviewChart from "../../components/DashboardOverviewChart";
import CenterLeaderBoard from "../../components/CenterLeaderBoard";
import CenterDevoteeTable from "../../components/CenterDevoteeTable";
import { columns, rows } from "../../mockData";
import { getTopThreeDevotees } from "../../utils";

const Dashboard = () => {
  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      <Grid item size={{ xs: 12 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mt: 1,
          }}
        >
          Unified Devotion Overview
        </Typography>
      </Grid>

      <Grid item size={{ xs: 12, md: 6 }}>
        <DashboardOverviewChart />
      </Grid>

      <Grid item size={{ xs: 12, md: 6 }}>
        <CenterLeaderBoard
          title={"Global Leaderboard"}
          rows={getTopThreeDevotees(rows).map((el, index) => {
            return {
              name: el.devoteeName,
              mentor: el.mentorName,
              rank: index + 1,
            };
          })}
        />
      </Grid>
      <Grid item size={{ xs: 12 }}>
        <CenterDevoteeTable
          title={"All Devotees"}
          rows={rows}
          columns={columns}
        />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
