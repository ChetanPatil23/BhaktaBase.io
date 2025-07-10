import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useBhaktiCenter } from "../../contexts/BhaktiCenterContext";
import { APP_NAME } from "../../constants";
import { fetchFromApi } from "../../constants/apiconfig";
import hkImage from "../../assets/hk.png";
const Login = () => {
  const [userId, setUserId] = useState("");
  const [centers, setCenters] = useState([]);
  const { center, updateCenter } = useBhaktiCenter();
  const navigate = useNavigate();

  // const fetchCenters = async () => {
  //   try {
  //     const response = await fetch(
  //       "http://localhost:3000/center",
  //       {
  //         headers: new Headers({
  //           "ngrok-skip-browser-warning": "69420",
  //         }),
  //       }
  //     );
  //     const data = await response.json();
  //     setCenters(data);
  //   } catch (error) {
  //     console.error("Error fetching centers:", error);
  //   }
  // };

  const fetchCenters = async () => {
    try {
      const data = await fetchFromApi("/center");
      setCenters(data);
    } catch (error) {
      console.error("Error fetching centers:", error);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const isValid = userId.length >= 6 && center !== "";

  const handleLogin = () => {
    console.log("Logging in with:", userId);
    navigate("/bhakti-centers");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh", // Full height for the page
        display: "flex", // Flexbox for centering
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        backgroundColor: "#000", // Black background
        padding: { xs: 2, sm: 4 }, // Responsive padding
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={5}
          sx={{
            p: { xs: 3, sm: 4 }, // Responsive padding
            borderRadius: 3, // Rounded corners
            backgroundColor: "#fff", // White background for the form
          }}
        >
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            sx={{
              color: "#115293",
              fontWeight: 600,
              fontSize: { xs: "1.25rem", sm: "1.8rem" },
              mb: -1.25,
            }}
          >
            <img
              src={hkImage}
              alt="logo"
              style={{
                width: "100%", // Default width for responsiveness
                maxWidth: "160px", // Maximum width for larger screens
                height: "auto", // Maintain aspect ratio
              }}
            />
          </Typography>
          <Typography
            align="center"
            gutterBottom
            sx={{
              color: "#115293",
              fontWeight: 600,
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            Welcome to the {APP_NAME}
          </Typography>
          <Typography
            variant="body2"
            align="center"
            sx={{
              color: "#5c6b7a",
              mb: 3,
              fontSize: { xs: "0.75rem", sm: "0.9rem" },
            }}
          >
            Track daily bhakti progress, center-wise, with blessings from
            Krishna.
          </Typography>

          <TextField
            label="Devotee ID"
            variant="outlined"
            fullWidth
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            helperText="Minimum 6 characters"
            error={userId.length > 0 && userId.length < 6}
          />

          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel>Bhakti Center</InputLabel>
            <Select
              value={center}
              onChange={(e) => updateCenter(e.target.value)}
              label="Bhakti Center"
            >
              {/* {centers.map((c) => (
              <MenuItem key={c.name} value={c.name}>
                {c.name}
              </MenuItem>
            ))} */}
              <MenuItem value="Panathur">Panathur</MenuItem>
              <MenuItem value="Whitefield">Whitefield</MenuItem>
              <MenuItem value="AECS Layout">AECS Layout</MenuItem>
            </Select>
          </FormControl>

          <Box mt={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={!isValid}
              onClick={handleLogin}
              sx={{
                backgroundColor: "#115293",
                "&:hover": {
                  backgroundColor: "#0d3f70",
                },
              }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
