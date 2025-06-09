import React, { useState } from "react";
import {
  AppBar,
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AccountCircle,
} from "@mui/icons-material";
import AppDrawer from "../AppDrawer";
import { APP_NAME } from "../../constants";
import { useBhaktiCenter } from "../../contexts/BhaktiCenterContext";
import { useNavigate } from "react-router-dom";

const AppHeader = ({ openDrawer, setOpenDrawer }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { selectedCenter, updateCenter } = useBhaktiCenter();
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
    setAnchorEl(null);
  };

  const handleLogout = () => {
    navigate("/login");
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
          <FormControl size="small" sx={{ minWidth: 150, ml: 2 }}>
            <Select
              value={selectedCenter}
              onChange={(e) => updateCenter(e.target.value)}
              sx={{
                color: "#e0e0e0",
                background: "linear-gradient(45deg, black, transparent)",
                ".MuiSelect-icon": { color: "#e0e0e0" },
                "& .MuiOutlinedInput-notchedOutline": { border: 0 },
              }}
            >
              <MenuItem value="Panathur">Panathur</MenuItem>
              <MenuItem value="Whitefield">Whitefield</MenuItem>
              <MenuItem value="AECS Layout">AECS Layout</MenuItem>
            </Select>
          </FormControl>
          <IconButton color="#e0e0e0" onClick={handleMenuClick}>
            <AccountCircle sx={{ color: "#e0e0e0" }} />
          </IconButton>
          <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleCloseMenu}>
            <MenuItem onClick={handleCloseMenu}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <AppDrawer openDrawer={openDrawer} toggleDrawer={toggleDrawer} />
    </>
  );
};

export default AppHeader;
