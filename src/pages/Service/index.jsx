import React, { use, useEffect, useState } from "react";
import {
  Grid,
  IconButton,
  Box,
  TextField,
  useTheme,
  MenuItem,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import AddParticipantsModal from "./AddParticipantsModal";
import { useBhaktiCenter } from "../../contexts/BhaktiCenterContext";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CustomSnackbar from "../../components/Snackbar/CustomSnackbar";

const Services = () => {
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [session, setSession] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const handleChange = (event) => {
    setSession(event.target.value);
  };
  const { selectedCenter, centers } = useBhaktiCenter();
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchSessions();
    // fetchParticipants();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const centerId =
        centers.find((el) => el.name === selectedCenter)?._id || "";

      const response = await fetch(
        `http://localhost:3000/service?center/${centerId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (session) {
      fetchServices();
    }
  }, [session]);

  useEffect(() => {
    setSession("");
  }, [selectedCenter]);

  const handleViewParticipants = (params) => {
    setSelectedService(params.row);
    fetchParticipants();
    setOpenModal(true);
  };

  const fetchParticipants = async () => {
    try {
      //   const centerId =
      //     centers.find((el) => el.name === selectedCenter)?._id || "";
      const response = await fetch(`http://localhost:3000/user`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let data = await response.json();

      const coordinator = selectedService.coordinator;
      const participants = selectedService.participants;
      if (coordinator && participants.length && data.length > 0) {
        data = [coordinator, ...participants, ...data];
      }

      setSelectedParticipants(data);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await fetch(`http://localhost:3000/batch`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSessions(data.map((el) => el.name));
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Service Name",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleViewParticipants(params)}
            sx={{
              color: "gray",
            }}
          >
            <GroupAddIcon />
          </IconButton>

          {/* <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>*/}
          <IconButton onClick={() => handleDelete(params.row._id)}>
            <DeleteIcon />
          </IconButton>
          {params.row.participants?.length > 0 ? (
            <IconButton
              size="small"
              sx={{
                "&.Mui-disabled": {
                  backgroundColor: "green",
                  color: "white",
                },
                height: "20px",
                width: "20px",
                marginLeft: "5px",
              }}
              disabled
            >
              <CheckIcon style={{ fontSize: "12px" }} />
            </IconButton>
          ) : (
            <span style={{ marginLeft: "34px" }}></span>
          )}
        </Box>
      ),
    },
  ].filter(Boolean);

  const handleEdit = (row) => {
    console.log("Edit row:", row);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/service/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      fetchServices();
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedParticipants([]);
  };

  return (
    <Grid
      container
      spacing={3}
      sx={{ padding: { xs: 1, sm: 2 }, width: "100%" }}
    >
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
          {sessions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      {session && (
        <Grid
          item
          size={{ xs: 12 }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              rows={services.map((el, index) => {
                return {
                  name: el.name,
                  participants: el.participants,
                  id: index,
                  coordinator: el.coordinator,
                  _id: el._id,
                };
              })}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection={false}
              disableRowSelectionOnClick
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f5f5",
                  fontWeight: "bold",
                },
                width: { xs: "100%", sm: "80%", md: "60%", lg: "50%" },
                maxWidth: "800px",
              }}
            />
          )}
        </Grid>
      )}

      <AddParticipantsModal
        selectedService={selectedService}
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        selectedParticipants={selectedParticipants}
        fetchServices={fetchServices}
        setSnackbarMessage={setSnackbarMessage}
        setSnackbarSeverity={setSnackbarSeverity}
        setSnackbarOpen={setSnackbarOpen}
      />
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </Grid>
  );
};

export default Services;
