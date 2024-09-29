import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, CardContent, Typography, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import DownloadPage from "./DownloadPage";
import { Project } from "../types";
import FilePage from './FilePage'; 

const ProgressPage: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3001/projects");
        const projectsData = response.data;

        const combinedProjects = projectsData.map((project: Project) => ({
          ...project,
          stages: project.stages || [],
        }));

        setProjects(combinedProjects);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewStages = (project: Project) => {
    setSelectedProject(null);
    setTimeout(() => {
      setSelectedProject(project);
    }, 0);
  };
 

  return (
    <Box style={{ padding: "20px" }}>
      {/* <Typography variant="h4" gutterBottom align="center">
        Projects Progress
      </Typography> */}

{/* Dropdown Menu for Projects */}
      <FormControl style={{ display: 'flex' ,width:'15%', justifyContent: 'center'
    
      }} size="small" margin="normal"
      >
        <InputLabel>Select Project</InputLabel>
        <Select
          
          value={selectedProject?.projectId || ""}
          onChange={(e) => {
            const projectId = e.target.value;
            const selected = projects.find((project) => project.projectId === projectId);
            if (selected) handleViewStages(selected);
          }}
          displayEmpty
        >
          {projects.map((project) => (
            <MenuItem key={project.projectId} value={project.projectId}>
              {project.projectName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      

      {selectedProject && (
        <Box mt={5}>
          <Typography variant="h4" align="center" gutterBottom>
            Project Stages for {selectedProject.projectName}
          </Typography>
          <DownloadPage
            projectId={selectedProject.projectId}
            projectName={selectedProject.projectName}
            stages={selectedProject.stages}
            isAdmin={isAdmin}
          />
        </Box>
      )}

      {!selectedProject && (
        <Box mt={5}>
          <FilePage />
        </Box>
      )}
    </Box>
  );
};

export default ProgressPage;
