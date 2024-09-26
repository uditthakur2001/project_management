import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import ProgressPage from "./components/ProgressPage";
import { Provider } from "react-redux";
import store from "./redux/store"; 
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import ProjectDetails from './components/ProjectDetails';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppBar position="sticky">
            <Toolbar>
              <Typography variant="h5" sx={{ flexGrow: 1, color: "white" }}>
                Project Management
              </Typography>
              <Button
                component={Link}
                to="/"
                color="inherit"
                sx={{
                  fontWeight: "bold",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  color: "white" 
                }}
              >
                Progress Page
              </Button>
             
              {isLoggedIn ? (
                <Button
                  component={Link}
                  to="/admin"
                  color="inherit"
                  sx={{
                    fontWeight: "bold",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    color: "white" 
                  }}
                >
                  Admin Panel
                </Button>
              ) : (
                <Button
                  component={Link}
                  to="/admin-login"
                  color="inherit"
                  sx={{
                    fontWeight: "bold",
                    borderRadius: "8px",
                    padding: "10px 20px",
                  }}
                >
                  Admin Login
                </Button>
              )}
            </Toolbar>
          </AppBar>
          <Routes>
            <Route path="/" element={<ProgressPage />} />
            <Route path="/project-details/:projectId" element={<ProjectDetails />} />
            <Route
              path="/admin"
              element={
                isLoggedIn ? (
                  <AdminPanel onLogout={handleLogout} />
                ) : (
                  <Navigate to="/admin-login" />
                )
              }
            />
            <Route
              path="/admin-login"
              element={<Login onLogin={handleLogin} />}
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
