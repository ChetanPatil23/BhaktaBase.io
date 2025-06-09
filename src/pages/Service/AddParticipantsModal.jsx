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

const participantColumnsMock = [
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    minWidth: 150,
  },
  {
    field: "role",
    headerName: "Role",
    flex: 1,
    minWidth: 150,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const [selectedRole, setSelectedRole] = React.useState(
        params.row.role || ""
      );

      const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
        console.log(`Role for ${params.row.name}:`, event.target.value);
        // Add functionality to update the role in the backend or state
      };

      return (
        <Select
          value={selectedRole}
          onChange={handleRoleChange}
          fullWidth
          size="small"
          sx={{
            fontSize: "0.9rem",
            textAlign: "center",
          }}
        >
          <MenuItem
            value=""
            sx={{
              height: { xs: 20, sm: 30 },
              fontSize: { xs: "0.8rem", sm: "1rem" }
            }}
          ></MenuItem>
          <MenuItem
            value="Sevak"
            sx={{
              height: { xs: 30, sm: 40 },
              fontSize: { xs: "0.8rem", sm: "1rem" },
            }}
          >
            Sevak
          </MenuItem>
          <MenuItem
            value="Lead Sevak"
            sx={{
              height: { xs: 30, sm: 40 },
              fontSize: { xs: "0.8rem", sm: "1rem" },
            }}
          >
            Lead
          </MenuItem>
        </Select>
      );
    },
  },
  {
    field: "phone",
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
  selectedParticipantsMock,
  isAssignDisabled,
  selectedService,
}) => {
  const [level, setLevel] = React.useState("Level 1");
  const theme = useTheme();
  return (
    <Modal open={openModal} onClose={handleCloseModal}>
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
          <Typography variant="h5">Participants</Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{
              textTransform: "none",
            }}
            onClick={() => {
              console.log("Add Members button clicked");
            }}
            disabled={isAssignDisabled}
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
          rows={selectedParticipantsMock}
          columns={participantColumnsMock}
          title={selectedService}
        />
      </Box>
    </Modal>
  );
};

export default AddParticipantsModal;
