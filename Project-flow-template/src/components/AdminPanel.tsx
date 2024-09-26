import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  MenuItem,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";
import SweetAlert from "sweetalert2";

const AdminPanel: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [projectName, setProjectName] = useState("");
  const [stageName, setStageName] = useState("");
  const [downloadName, setDownloadName] = useState("");
  const [downloadDescription, setDownloadDescription] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:3001/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchDownloads = async () => {
    try {
      const response = await axios.get("http://localhost:3001/downloads");
      setDownloads(response.data);
    } catch (error) {
      console.error("Error fetching downloads:", error);
    }
  };

  const fetchStages = async () => {
    if (selectedProject) {
      try {
        const response = await axios.get(
          `http://localhost:3001/projects/${selectedProject}`
        );
        setStages(response.data.stages || []);
      } catch (error) {
        console.error("Error fetching stages:", error);
      }
    } else {
      setStages([]);
    }
  };

  const handleAddProject = async () => {
    if (projectName.length > 0 && stages) {
      const existingProject = projects.find(
        (p) => p.projectName.toLowerCase() === projectName.toLowerCase()
      );
      if (existingProject) {
        return SweetAlert.fire(
          "Error",
          "Project name already exists. Please choose a different name.",
          "error"
        );
      }

      try {
        await axios.post("http://localhost:3001/projects", { projectName });
        fetchProjects();
        setProjectName("");
        setStages([]);
        SweetAlert.fire("Success", "Project added successfully!", "success");
      } catch (error) {
        console.error("Error adding project:", error);
        SweetAlert.fire(
          "Error",
          "Error adding project. Please try again.",
          "error"
        );
      }
    } else {
      SweetAlert.fire(
        "Error",
        "Please provide a project name and at least one stage.",
        "error"
      );
    }
  };

  const handleAddStage = async () => {
    if (selectedProject && stageName) {
      try {
        await axios.post(
          `http://localhost:3001/projects/stage/${selectedProject}`,
          { name: stageName }
        );
        fetchStages();
        setStageName("");
        SweetAlert.fire("Success", "Stage added successfully!", "success");
      } catch (error) {
        console.error("Error adding stage:", error);
        SweetAlert.fire(
          "Error",
          "Error adding stage. Please try again.",
          "error"
        );
      }
    }
  };

  const handleAddDownload = async () => {
    if (downloadName && downloadDescription && downloadUrl) {
      try {
        await axios.post("http://localhost:3001/downloads", {
          name: downloadName,
          description: downloadDescription,
          url: downloadUrl,
        });
        fetchDownloads();
        setDownloadName("");
        setDownloadDescription("");
        setDownloadUrl("");
        SweetAlert.fire("Success", "Download added successfully!", "success");
      } catch (error) {
        console.error("Error adding download:", error);
        SweetAlert.fire(
          "Error",
          "Error adding download. Please try again.",
          "error"
        );
      }
    }
  };

  const handleChangeStageStatus = async (
    stageId: string,
    currentStatus: string
  ) => {
    if (selectedProject) {
      let newStatus;
      if (currentStatus === "ongoing") {
        newStatus = "completed";
      } else if (currentStatus === "completed") {
        newStatus = "incomplete";
      } else {
        newStatus = "ongoing";
      }

      try {
        await axios.put(
          `http://localhost:3001/projects/stage/${selectedProject}/${stageId}`,
          { status: newStatus }
        );
        fetchStages();
      } catch (error) {
        console.error("Error changing stage status:", error);
      }
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await axios.delete(`http://localhost:3001/projects/${projectId}`);
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleDeleteStage = async (stageId: number) => {
    if (selectedProject) {
      try {
        await axios.delete(
          `http://localhost:3001/projects/stage/${selectedProject}/${stageId}`
        );
        fetchStages();
      } catch (error) {
        console.error("Error deleting stage:", error);
      }
    }
  };

  const handleDeleteDownload = async (downloadId: number) => {
    try {
      await axios.delete(`http://localhost:3001/downloads/${downloadId}`);
      fetchDownloads();
    } catch (error) {
      console.error("Error deleting download:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchDownloads();
  }, []);

  useEffect(() => {
    fetchStages();
  }, [selectedProject]);

  return (
    <Box p={3} style={{ backgroundColor: "#f0f4f8", minHeight: "100vh" }}>
      <AppBar
        position="static"
        style={{
          marginBottom: "20px",
          // background: "linear-gradient(45deg, #3f51b5 30%, #ff4081 90%)"
        }}
      >
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, color: "white" }}>
            Admin Panel
          </Typography>
          <Button
            color="inherit"
            onClick={onLogout}
            style={{ background: "#dc004e", color: "white" }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Typography variant="h4" gutterBottom style={{ color: "#3f51b5" }}>
        Manage Projects and Stages
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Paper
          elevation={5}
          style={{
            padding: "16px",
            flex: 1,
            marginRight: "10px",
            backgroundColor: "#ffffff",
            borderRadius: "15px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
          }}
        >
          <TextField
            label="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            fullWidth
            variant="outlined"
            style={{ marginBottom: "10px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddProject}
            startIcon={<AddIcon />}
            style={{ marginTop: "10px", borderRadius: "25px" }}
          >
            Add Project
          </Button>

          {projects.map((project) => (
            <Box
              key={project.projectId}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              style={{
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#e3f2fd",
                borderRadius: "10px",
              }}
            >
              <Typography variant="body1">{project.projectName}</Typography>
              <IconButton
                color="secondary"
                onClick={() => handleDeleteProject(project.projectId)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Paper>

        <Paper
          elevation={5}
          style={{
            padding: "16px",
            flex: 1,
            marginLeft: "10px",
            backgroundColor: "#ffffff",
            borderRadius: "15px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
          }}
        >
          <TextField
            label="Select Project"
            select
            value={selectedProject || ""}
            onChange={(e) => setSelectedProject(e.target.value)}
            fullWidth
            variant="outlined"
            style={{ marginBottom: "10px" }}
          >
            {projects.map((project) => (
              <MenuItem key={project.projectId} value={project.projectId}>
                {project.projectName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Stage Name"
            value={stageName}
            onChange={(e) => setStageName(e.target.value)}
            fullWidth
            variant="outlined"
            style={{ marginBottom: "10px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddStage}
            startIcon={<AddIcon />}
            style={{ marginTop: "10px", borderRadius: "25px" }}
          >
            Add Stage
          </Button>

          {stages.map((stage) => (
            <Box
              key={stage.id}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              style={{
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#e3f2fd",
                borderRadius: "10px",
              }}
            >
              <Typography variant="body1">{stage.name}</Typography>
              <Box>
                <Button
                  variant="contained"
                  onClick={() =>
                    handleChangeStageStatus(stage.id, stage.status)
                  }
                  style={{
                    marginRight: "10px",
                    backgroundColor:
                      stage.status === "ongoing"
                        ? "rgba(255, 165, 0, 0.5)" 
                        : stage.status === "completed"
                        ? "rgba(0, 128, 0, 0.5)"
                        : "rgba(128, 128, 128, 0.5)", 
                    color: "black", 
                  }}
                >
                  {stage.status === "ongoing"
                    ? "Ongoing"
                    : stage.status === "completed"
                    ? "Completed"
                    : "Incomplete"}
                </Button>

                <IconButton
                  color="secondary"
                  onClick={() => handleDeleteStage(stage.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Paper>
      </Box>

      <Typography variant="h4" gutterBottom style={{ color: "#3f51b5" }}>
        Manage Downloads
      </Typography>
      <Paper
        elevation={5}
        style={{
          padding: "16px",
          backgroundColor: "#ffffff",
          borderRadius: "15px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
        }}
      >
        <TextField
          label="Download Name"
          value={downloadName}
          onChange={(e) => setDownloadName(e.target.value)}
          fullWidth
          variant="outlined"
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Description"
          value={downloadDescription}
          onChange={(e) => setDownloadDescription(e.target.value)}
          fullWidth
          variant="outlined"
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Download URL"
          value={downloadUrl}
          onChange={(e) => setDownloadUrl(e.target.value)}
          fullWidth
          variant="outlined"
          style={{ marginBottom: "10px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddDownload}
          startIcon={<AddIcon />}
          style={{ borderRadius: "25px" }}
        >
          Add Download
        </Button>

        {downloads.map((download) => (
          <Box
            key={download.id}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            style={{
              marginTop: "10px",
              padding: "10px",
              backgroundColor: "#e3f2fd",
              borderRadius: "10px",
            }}
          >
            <Typography variant="body1">{download.name}</Typography>
            <IconButton
              color="secondary"
              onClick={() => handleDeleteDownload(download.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default AdminPanel;
