import React from "react";
import CenterDevoteeTable from "../../components/CenterDevoteeTable";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ContactIcons from "../../components/ContactIcons";
import { levels } from "../../constants";
import StarsIcon from "@mui/icons-material/Stars";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import CustomSnackbar from "../../components/Snackbar/CustomSnackbar";

export const participantColumnsMock = (
  handleRoleChange,
  selectedRowsWithRoles,
  selectedService
) => [
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    minWidth: 150,
    renderCell: (params) => {
      const isLeadSevak =
        selectedRowsWithRoles.find((row) => row.id === params.row.id)?.role ===
        "Lead Sevak";
      const isSevak =
        selectedRowsWithRoles.find((row) => row.id === params.row.id)?.role ===
        "Sevak";

      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            position: "relative",
          }}
        >
          <Typography variant="body2">{params.row.name}</Typography>
          {isLeadSevak && (
            <StarsIcon
              sx={{
                fontSize: "1rem",
                color: "gold",
                position: "absolute",
                top: "8px",
                left: "-10px",
              }}
            />
          )}
          {isSevak && (
            <EmojiPeopleIcon
              sx={{
                fontSize: "1rem",
                color: "lightgray",
                position: "absolute",
                top: "8px",
                left: "-10px",
              }}
            />
          )}
        </Box>
      );
    },
  },
  {
    field: "Role",
    headerName: "Role",
    flex: 1,
    minWidth: 150,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const selectedRole =
        selectedRowsWithRoles.find((row) => row.id === params.row.id)?.role ||
        (selectedService.coordinator &&
        selectedService.coordinator._id === params.row.id
          ? "Lead Sevak"
          : selectedService.participants.some(
                (participant) => participant._id === params.row.id
              )
            ? "Sevak"
            : "");
      const isLeadSevakSelected = selectedRowsWithRoles.some(
        (row) => row.role === "Lead Sevak" && row.id !== params.row.id
      );

      const handleLocalRoleChange = (event) => {
        const updatedRole = event.target.value;
        handleRoleChange(event, params.row);
      };

      return (
        <Select
          value={selectedRole}
          onChange={handleLocalRoleChange}
          fullWidth
          size="small"
          sx={{
            fontSize: "0.9rem",
            textAlign: "center",
          }}
        >
          {selectedRole && (
            <MenuItem
              value=""
              sx={{
                height: { xs: 10, sm: 30 },
                fontSize: { xs: "0.8rem", sm: "1rem" },
              }}
            ></MenuItem>
          )}
          <MenuItem value="Sevak">Sevak</MenuItem>
          <MenuItem value="Lead Sevak" disabled={isLeadSevakSelected}>
            Lead Sevak
          </MenuItem>
        </Select>
      );
    },
  },
  {
    field: "contact",
    headerName: "Contact",
    flex: 1,
    minWidth: 100,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => <ContactIcons params={params} />,
  },
];

const AddParticipantsModal = ({
  openModal,
  handleCloseModal,
  selectedParticipants,
  selectedService,
  fetchServices,
}) => {
  const [level, setLevel] = React.useState("Level 1");
  const theme = useTheme();
  const [selectedRowsWithRoles, setSelectedRowsWithRoles] = React.useState([]);
  console.log(selectedService, "selectedService in modal");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");

  React.useEffect(() => {
    if (openModal && selectedService) {
      const initialRows = [];

      if (selectedService.coordinator) {
        initialRows.push({
          id: selectedService.coordinator._id,
          role: "Lead Sevak",
        });
      }

      if (
        selectedService.participants &&
        selectedService.participants.length > 0
      ) {
        selectedService.participants.forEach((participant) => {
          initialRows.push({
            id: participant._id,
            role: "Sevak",
          });
        });
      }

      setSelectedRowsWithRoles(initialRows);
    }
  }, [openModal, selectedService]);

  const handleRoleChange = (event, row) => {
    const updatedRole = event.target.value;
    const updatedRow = { ...row, role: updatedRole };
    setSelectedRowsWithRoles((prev) => {
      const filteredRows = prev.filter((r) => r.id !== row.id);
      return updatedRole ? [...filteredRows, updatedRow] : filteredRows;
    });
  };

  const handleAssignParticipants = async () => {
    const coordinator = selectedRowsWithRoles.find(
      (row) => row.role === "Lead Sevak"
    );
    const participants = selectedRowsWithRoles
      .filter((row) => row.role === "Sevak")
      .map((row) => row.id);

    const payload = {
      coordinator: coordinator ? coordinator.id : null,
      participants,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/service/${selectedService._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setSnackbarMessage("Participants assigned successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchServices();
    } catch (error) {
      console.error("Error assigning participants:", error);
      setSnackbarMessage("Failed to assign participants. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Modal
      open={openModal}
      onClose={() => {
        handleCloseModal();
        setSelectedRowsWithRoles([]);
        setLevel("Level 1");
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 600 },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5">
            Participants{" "}
            {selectedRowsWithRoles.length
              ? `(${selectedRowsWithRoles.length})`
              : ""}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{
              textTransform: "none",
            }}
            onClick={handleAssignParticipants}
            disabled={selectedRowsWithRoles.length == 0}
          >
            Assign
            <CheckIcon fontSize="small" style={{ marginLeft: "5px" }} />
          </Button>
        </Box>
        <Grid
          item
          size={{ xs: 12 }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "12px 0px",
          }}
        >
          <TextField
            select
            fullWidth
            required={true}
            label={"Choose Level"}
            name={"level"}
            value={level}
            onChange={(event) => setLevel(event.target.value)}
            sx={{
              width: "100%",
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
        <CenterDevoteeTable
          rows={selectedParticipants.users}
          columns={participantColumnsMock(
            handleRoleChange,
            selectedRowsWithRoles,
            selectedService
          )}
          title={selectedService.name}
        />
        <CustomSnackbar
          open={snackbarOpen}
          message={snackbarMessage}
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
        />
      </Box>
    </Modal>
  );
};

export default AddParticipantsModal;
