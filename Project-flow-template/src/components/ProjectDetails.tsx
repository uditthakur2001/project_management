import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Stage {
  id: number;
  name: string;
  status: string; 
}

interface Project {
  projectId: number;
  projectName: string;
  stages: Stage[]; 
}

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/projects/${projectId}`);
        console.log('API response:', response.data); 
        setProject(response.data);
      } catch (error) {
        setError('Error fetching project details. Please try again later.');
        console.error('Error fetching project details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center" style={{ padding: '20px' }}>
        {error}
      </Typography>
    );
  }

  const ongoingStages = project?.stages.filter(stage => stage.status === 'ongoing') || [];
  const completedStages = project?.stages.filter(stage => stage.status === 'completed') || [];

  return (
    <div style={{ padding: '20px' }}>
      {project ? (
        <>
          <Typography variant="h4" gutterBottom>
            {project.projectName}
          </Typography>

          <Card sx={{ marginBottom: '20px', borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5">Ongoing Stages</Typography>
              {ongoingStages.length > 0 ? (
                ongoingStages.map((stage) => (
                  <div key={stage.id}>
                    {stage.name}
                  </div>
                ))
              ) : (
                <Typography>No ongoing stages</Typography>
              )}
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5">Completed Stages</Typography>
              {completedStages.length > 0 ? (
                completedStages.map((stage) => (
                  <div key={stage.id}>
                    {stage.name}
                  </div>
                ))
              ) : (
                <Typography>No completed stages</Typography>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Typography variant="h6" color="error" align="center">
          Project not found.
        </Typography>
      )}
    </div>
  );
};

export default ProjectDetails;
