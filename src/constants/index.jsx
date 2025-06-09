import * as React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";

export const APP_NAME = "BhaktaBase.io";
export const mainItems = [
  { text: "Dashboard", icon: <DashboardIcon /> },
  { text: "Add Devotee", icon: <PersonIcon /> },
];

export const chantingMilestones = ["Chanting 1", "Chanting 2"];

export const bhaktiCenters = [
  "Panathur",
  "Whitefield",
  "Aecs layout",
];

export const levels = ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5"];
export const rounds = [1, 2, 4, 6, 8, 10, 12, 16];
export const PANATHUR_LOCATION = { lat: 12.9296, lng: 77.7037 };
export const minSelectWidth = 222.67;
