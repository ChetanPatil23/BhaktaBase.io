import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  TempleHindu as TempleHinduIcon,
} from "@mui/icons-material";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AccountCircle as AccountCircleIcon } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import EventIcon from "@mui/icons-material/Event";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const AppDrawer = ({ openDrawer, toggleDrawer }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const mainItems = [
    {
      text: "Bhakti Centers",
      icon: <TempleHinduIcon />,
      to: "/bhakti-centers",
    },
    { text: "Add Member", icon: <PersonAddIcon />, to: "/add-member" },
    { text: "Attendance", icon: <AssignmentIndIcon />, to: "/attendance" },
  ];
  const secondaryItems = [
    { text: "Dashboard", icon: <DashboardIcon />, to: "/dashboard" },
    { text: "Services", icon: <VolunteerActivismIcon />, to: "/services" },
    { text: "Sessions History", icon: <EventIcon />, to: "/sessions-history" },
  ];

  const drawerWidth = isMobile ? (openDrawer ? 240 : 0) : openDrawer ? 240 : 60;

  const closeDrawerOnMobile = () => {
    if (isMobile) {
      toggleDrawer();
    }
  };

  const handleLogout = () => {
    navigate("/login");
    toggleDrawer();
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          transition: "width 0.3s ease",
        },
        backgroundColor: "ghostwhite",
        transition: "width 0.3s ease",
      }}
      variant="persistent"
      anchor="left"
      open={openDrawer || !isMobile}
    >
      <List sx={{ marginTop: "64px" }}>
        {mainItems.map((item, index) => (
          <ListItem
            button
            key={index}
            component={Link}
            to={item.to}
            sx={{
              backgroundColor:
                location.pathname === item.to ? "#1976D2" : "transparent",
              color: location.pathname === item.to ? "white" : "#115293",
              fontWeight: location.pathname === item.to ? "bold" : "",
              "&:hover": {
                backgroundColor: "#1565C0",
                color: "white",
              },
              height: "48px",
              transition: "background-color 0.3s ease, color 0.3s ease",
            }}
            onClick={closeDrawerOnMobile}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.to ? "white" : "inherit",
                minWidth: openDrawer ? "56px" : "auto",
                transition: "min-width 0.3s ease, color 0.3s ease",
              }}
            >
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={item.text}
              sx={{
                opacity: openDrawer ? 1 : 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                transition: "opacity 0.3s ease",
              }}
            />
          </ListItem>
        ))}

        <Divider />
        {secondaryItems.map((item, index) => (
          <ListItem
            button
            key={index}
            component={Link}
            to={item.to}
            sx={{
              backgroundColor:
                location.pathname === item.to ? "#1976D2" : "transparent",
              color: location.pathname === item.to ? "white" : "#115293",
              "&:hover": {
                backgroundColor: "#1565C0",
                color: "white",
              },
              height: "48px",
              transition: "background-color 0.3s ease, color 0.3s ease",
            }}
            onClick={closeDrawerOnMobile}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.to ? "white" : "inherit",
                minWidth: openDrawer ? "56px" : "auto",
                transition: "min-width 0.3s ease",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                opacity: openDrawer ? 1 : 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                transition: "opacity 0.3s ease",
              }}
            />
          </ListItem>
        ))}
        <Divider />

        {/* Profile Section */}
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            backgroundColor:
              location.pathname === "/profile" ? "#1976D2" : "transparent",
            color: location.pathname === "/profile" ? "white" : "#115293",
            "&:hover": {
              backgroundColor: "#1565C0",
              color: "white",
            },
            height: "48px",
            transition: "background-color 0.3s ease, color 0.3s ease",
          }}
        >
          <ListItemIcon
            sx={{
              color: location.pathname === "/profile" ? "white" : "inherit",
              minWidth: openDrawer ? "56px" : "auto",
              transition: "min-width 0.3s ease, color 0.3s ease",
            }}
          >
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText
            primary="Profile"
            sx={{
              opacity: openDrawer ? 1 : 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              transition: "opacity 0.3s ease",
            }}
          />
        </ListItem>
        {isMobile && (
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              backgroundColor:
                location.pathname === "/profile" ? "#1976D2" : "transparent",
              color: location.pathname === "/profile" ? "white" : "#115293",
              "&:hover": {
                backgroundColor: "#1565C0",
                color: "white",
              },
              height: "48px",
              transition: "background-color 0.3s ease, color 0.3s ease",
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === "/profile" ? "white" : "inherit", // Active icon color
                minWidth: openDrawer ? "56px" : "auto",
                transition: "min-width 0.3s ease, color 0.3s ease",
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{
                opacity: openDrawer ? 1 : 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                transition: "opacity 0.3s ease",
              }}
            />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default AppDrawer;
