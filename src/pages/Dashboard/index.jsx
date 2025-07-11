import { Grid, Typography } from "@mui/material";
import DashboardOverviewChart from "../../components/DashboardOverviewChart";
import CenterLeaderBoard from "../../components/CenterLeaderBoard";
import CenterDevoteeTable from "../../components/CenterDevoteeTable";
import { columns, rows } from "../../mockData";
import { getTopThreeDevotees } from "../../utils";

import { panathurData } from "../../mockData";
import { ChantingRounds } from "../../components/ChantingRounds";
import { CenterRegisterStatus } from "../../components/CenterRegisterStatus";


const Dashboard = () => {
  const counts = panathurData.reduce(
    (acc, { register }) => {
      if (register === "Y") acc.registered++;
      else if (register === "N") acc.nonRegistered++;
      return acc;
    },
    { registered: 0, nonRegistered: 0 }
  );

  const chantingGroups = Object.entries(
    panathurData.reduce((acc, { chantingRounds }) => {
      acc[chantingRounds] = (acc[chantingRounds] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, round]) => ({
    name: Number(name),
    uv: round,
    xname: `<=${Number(name)}`,
  }));

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
      <Grid item size={{ xs: 12, md: 6 }}>
        <CenterRegisterStatus
          rows={[
            { name: "Register Devotees", value: counts.registered },
            { name: "Non-Register Devotees", value: counts.nonRegistered },
          ]}
        />
      </Grid>
      <Grid item size={{ xs: 12, md: 6 }}>
        <ChantingRounds rows={chantingGroups} />
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
