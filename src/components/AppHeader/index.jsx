import React, { useState } from "react";
import {
  AppBar,
  FormControl,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import AppDrawer from "../AppDrawer";
import { APP_NAME } from "../../constants";
import { useBhaktiCenter } from "../../contexts/BhaktiCenterContext";
import { useNavigate } from "react-router-dom";
import theme from "../../theme/theme";
import { useMediaQuery } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const AppHeader = ({ openDrawer, setOpenDrawer }) => {
  const { selectedCenter, updateCenter } = useBhaktiCenter();
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleLogout = () => {
    setOpenLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setOpenLogoutModal(false);
    navigate("/login");
  };

  const handleCancelLogout = () => {
    setOpenLogoutModal(false);
  };
  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: 1300 }}>
        <Toolbar
          sx={{
            backgroundColor: "#115293",
            boxShadow: "none",
            paddingLeft: { md: "20px" },
          }}
        >
          <IconButton
            color="#1A1A1A"
            edge="start"
            onClick={toggleDrawer}
            sx={{
              mr: { xs: 0, sm: 0, md: 2 },
              color: "#e0e0e0",
              outline: "none !important",
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              color: "#e0e0e0",
              fontWeight: "bold",
              fontSize: { xs: "1rem", sm: "1.5rem" },
            }}
          >
            {APP_NAME}
          </Typography>
          <FormControl size="small">
            <Select
              value={selectedCenter}
              onChange={(e) => updateCenter(e.target.value)}
              sx={{
                color: "#e0e0e0",
                background: "linear-gradient(45deg, black, transparent)",
                ".MuiSelect-icon": { color: "#e0e0e0" },
                "& .MuiOutlinedInput-notchedOutline": { border: 0 },
                [theme.breakpoints.down("sm")]: {
                  height: "28px",
                  width: "140px",
                },
                [theme.breakpoints.up("md")]: {
                  width: "170px",
                },
              }}
            >
              <MenuItem value="Panathur">Panathur</MenuItem>
              <MenuItem value="Whitefield">Whitefield</MenuItem>
              <MenuItem value="AECS Layout">AECS Layout</MenuItem>
            </Select>
          </FormControl>
          {!isMobile && (
            <IconButton color="#e0e0e0" onClick={handleLogout}>
              <LogoutIcon sx={{ color: "#e0e0e0" }} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <AppDrawer openDrawer={openDrawer} toggleDrawer={toggleDrawer} />
      <Dialog
        open={openLogoutModal}
        onClose={handleCancelLogout}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="logout-dialog-title">Logout Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLogout} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AppHeader;
