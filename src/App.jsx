import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";
import Registration from "./pages/Registration";
import Dashboard from "./pages/Dashboard";
import BhaktiCenters from "./pages/Bhakti-Center/BhaktiCenter";
import Attendance from "./pages/Attendance";
import Login from "./pages/Login";
import MainLayout from "./components/MainLayout";
import Services from "./pages/Service";
import SessionHistory from "./pages/SessionHistory";

const App = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Router>
      <Routes>
        <Route index path="/" element={<Login />} />
        <Route
          path="/bhakti-centers"
          element={
            <MainLayout
              openDrawer={openDrawer}
              setOpenDrawer={setOpenDrawer}
              isSmallScreen={isSmallScreen}
            >
              <BhaktiCenters />
            </MainLayout>
          }
        />
        <Route
          path="add-member"
          element={
            <MainLayout
              openDrawer={openDrawer}
              setOpenDrawer={setOpenDrawer}
              isSmallScreen={isSmallScreen}
            >
              <Registration />
            </MainLayout>
          }
        />
        <Route
          path="attendance"
          element={
            <MainLayout
              openDrawer={openDrawer}
              setOpenDrawer={setOpenDrawer}
              isSmallScreen={isSmallScreen}
            >
              <Attendance />
            </MainLayout>
          }
        />
        <Route
          path="dashboard"
          element={
            <MainLayout
              openDrawer={openDrawer}
              setOpenDrawer={setOpenDrawer}
              isSmallScreen={isSmallScreen}
            >
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="services"
          element={
            <MainLayout
              openDrawer={openDrawer}
              setOpenDrawer={setOpenDrawer}
              isSmallScreen={isSmallScreen}
            >
              <Services />
            </MainLayout>
          }
        />
        <Route
          path="sessions-history"
          element={
            <MainLayout
              openDrawer={openDrawer}
              setOpenDrawer={setOpenDrawer}
              isSmallScreen={isSmallScreen}
            >
              <SessionHistory />
            </MainLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
