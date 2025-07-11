import {
  Badge,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import theme from "../../theme/theme";
import { columns, panathurData } from "../../mockData";
import CenterDevoteeTable from "../../components/CenterDevoteeTable";
import { useBhaktiCenter } from "../../contexts/BhaktiCenterContext";

const SessionHistory = () => {
  const [sessions, setSessions] = React.useState([]);
  const { batches } = useBhaktiCenter();
  const [session, setSession] = React.useState("");
  const [batch, setBatch] = React.useState("");
  const [speaker, setSpeaker] = React.useState("");
  const [date, setDate] = React.useState("");

  useEffect(() => {
    if (session) {
      console.log({ sessions, session });
      const selectedSession = sessions.find((el) => el.name === session);
      console.log(selectedSession, "selectedSession");
      if (selectedSession) {
        setSpeaker(selectedSession.conductor.name);
        setDate(selectedSession.date);
      } else {
        setSpeaker("");
        setDate("");
      }
    }
  }, [session]);

  const fetchSessions = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/session?batch=${batch}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  console.log(sessions, "sessions");
  useEffect(() => {
    if (batch) {
      fetchSessions();
    }
  }, [batch]);

  return (
    <Grid container spacing={3} sx={{ padding: 2, width: "100%" }}>
      <Grid
        container
        spacing={3}
        size={{ xs: 12 }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid
          item
          size={{ xs: 12, sm: 4 }}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TextField
            select
            fullWidth
            required={true}
            label={"Choose Batch"}
            name={"Batch"}
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            sx={{
              "& .MuiSelect-select": {
                textAlign: "left",
                color: theme.palette.text.primary,
              },
            }}
          >
            {batches.map((option) => (
              <MenuItem key={option._id} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid
          item
          size={{ xs: 12, sm: 4 }}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TextField
            select
            fullWidth
            required={true}
            label={"Choose Session"}
            name={"Session"}
            value={session}
            onChange={(e) => setSession(e.target.value)}
            sx={{
              "& .MuiSelect-select": {
                textAlign: "left",
                color: theme.palette.text.primary,
              },
              "& .Mui-disabled": {
                background: "#eee",
              },
            }}
            disabled={!batch}
          >
            {sessions.map((option) => (
              <MenuItem key={option._id} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
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
            Please select batch and session to view its details.
          </Typography>
        </Grid>
      )}

      {session && (
        <>
          <Grid
            item
            size={{ xs: 12 }}
            sx={{
              marginBottom: 2,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: 3,
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                width: "100%",
                maxWidth: "800px",
                // background:"#115293"
                background: "linear-gradient(to right, #115293, #000)",
              }}
            >
              {/* Badge for Session Taker */}
              <Badge
                badgeContent={`Speaker : ${speaker}`}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.75rem",
                    height: "24px",
                    padding: "0 8px",
                    backgroundColor: "#1976D2",
                    color: "white",
                    display: "inline-block",
                    whiteSpace: "nowrap",
                  },
                }}
              ></Badge>
              <Badge
                badgeContent={`Date : ${new Date(date).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}`}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.75rem",
                    height: "24px",
                    padding: "0 8px",
                    backgroundColor: "#1976D2",
                    color: "white",
                    display: "inline-block",
                    whiteSpace: "nowrap",
                  },
                }}
              ></Badge>
            </Paper>
          </Grid>
          <Grid item size={{ xs: 12 }}>
            <CenterDevoteeTable
              rows={panathurData}
              columns={columns}
              title={`Attended (${panathurData.length})`}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default SessionHistory;
