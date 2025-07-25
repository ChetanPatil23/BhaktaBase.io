import { Grid, TextField, useTheme, MenuItem, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CenterDevoteeChart from "../../components/CenterDevoteeChart";
import CenterLeaderBoard from "../../components/CenterLeaderBoard";
import CenterDevoteeTable from "../../components/CenterDevoteeTable";
import { levels } from "../../constants";
import { columns, panathurData } from "../../mockData";
import { useBhaktiCenter } from "../../contexts/BhaktiCenterContext";
import { CenterRegisterStatus } from "../../components/CenterRegisterStatus";
import { ChantingRounds } from "../../components/ChantingRounds";

const BhaktiCenter = () => {
  const [session, setSession] = useState("");
  const { selectedCenter } = useBhaktiCenter();
  const theme = useTheme();
  const rows = panathurData;

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

  useEffect(() => {
    setSession("");
  }, [selectedCenter]);

  const handleChange = (event) => {
    setSession(event.target.value);
  };

  const topPerformers = [...rows]
    .sort((a, b) => b.chantingRounds - a.chantingRounds)
    .slice(0, 3)
    .map((devotee, index) => {
      return {
        name: devotee.devoteeName,
        mentor: devotee.mentorName,
        rank: index + 1,
      };
    });

  return (
    <>
      <Grid container spacing={3} sx={{ padding: 2, width: "100%" }}>
        <Grid
          item
          size={{ xs: 12 }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            select
            fullWidth
            required={true}
            label={"Choose Session/Batch"}
            name={"Session"}
            value={session}
            onChange={handleChange}
            sx={{
              width: { xs: "100%", sm: "80%", md: "50%", lg: "40%" },
              maxWidth: "400px",
              "& .MuiSelect-select": {
                textAlign: "left",
                color: theme.palette.text.primary,
              },
            }}
          >
            {levels.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {!session && (
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
              flexGrow: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                color: theme.palette.text.secondary,
                fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
              }}
            >
              Please select a session to view center-wise data.
            </Typography>
          </Grid>
        )}

        {session && (
          <>
            <Grid item size={{ xs: 12, md: 6 }}>
              <CenterDevoteeChart rows={rows} />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <CenterLeaderBoard rows={topPerformers} />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <CenterRegisterStatus
                rows={[
                  { name: "Register Devotees", value: counts.registered },
                  {
                    name: "Non-Register Devotees",
                    value: counts.nonRegistered,
                  },
                ]}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <ChantingRounds rows={chantingGroups} />
            </Grid>
            <Grid item size={{ xs: 12 }}>
              <CenterDevoteeTable rows={rows} columns={columns} />
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default BhaktiCenter;
