import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, Typography, Box } from '@mui/material';
import DownloadPage from './DownloadPage'; 
import { Project} from '../types'; 
import FilePage from './FilePage'; 

const ProgressPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null); 
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); 
        const response = await axios.get('http://localhost:3001/projects');
        const projectsData = response.data;

        const combinedProjects = projectsData.map((project: Project) => ({
          ...project,
          stages: project.stages || [] 
        }));

        setProjects(combinedProjects);
      } catch (error) {
        console.error('Error fetching data:', error);
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
    <Box style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom align="center">
        Projects Progress
      </Typography>

      {loading ? (
        <Typography variant="h6" align="center">Loading projects...</Typography>
      ) : (
        <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="center" gap={5}>
          {projects.map((project) => (
            <Box key={project.projectId} width='250px'>
              <Card sx={{ boxShadow: 3, borderRadius: 2, height: '150px', transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)', 
                  }, }}>
                <CardContent
                  sx={{
                    height: '100%',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  <Typography variant="h5" align="center">{project.projectName}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewStages(project)} 
                    style={{ marginTop: '10px' }}
                  >
                    View Stages
                  </Button>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      {selectedProject && (
        <Box mt={5}>
          <Typography variant="h4" align="center" gutterBottom>
            Project Stages for {selectedProject.projectName}
          </Typography>
          <DownloadPage 
            projectName={selectedProject.projectName}
            stages={selectedProject.stages} 
            projectId={selectedProject.projectId}
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
