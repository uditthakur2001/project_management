import React, { useEffect } from 'react';
import { Typography, Container, Box } from '@mui/material';
import Board from '@asseinfo/react-kanban';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert
import { Stage } from '../types'; 

interface DownloadPageProps {
  projectName: string; 
  projectId: number; 
  stages: Stage[]; 
}

const DownloadPage: React.FC<DownloadPageProps> = ({ projectId, stages }) => {
  const dispatch = useDispatch();

  const board = {
    columns: [
      {
        id: 'ongoing',
        title: 'Ongoing',
        cards: stages
          .filter((stage) => stage.status === 'ongoing')
          .map((stage) => ({
            id: stage.id.toString(),
            title: stage.name,
            description: (
              <a href={stage.fileUrl} download>
                Download
              </a>
            ),
            status: 'ongoing',
          })),
      },
      {
        id: 'completed',
        title: 'Completed',
        cards: stages
          .filter((stage) => stage.status === 'completed')
          .map((stage) => ({
            id: stage.id.toString(),
            title: stage.name,
            description: (
              <a href={stage.fileUrl} download>
                Download
              </a>
            ),
            status: 'completed',
          })),
      },
      {
        id: 'incomplete',
        title: 'Incomplete',
        cards: stages
          .filter((stage) => stage.status === 'incomplete')
          .map((stage) => ({
            id: stage.id.toString(),
            title: stage.name,
            description: (
              <a href={stage.fileUrl} download>
                Download
              </a>
            ),
            status: 'incomplete',
          })),
      },
    ],
  };

  const handleCardDrag = async (board: any, card: any, source: any, destination: any) => {
    const newStatus = destination.toColumnId as 'ongoing' | 'completed' | 'incomplete';

    Swal.fire({
      title: 'Status Changed!',
      text: `The stage status has been changed to ${newStatus}.`,
      icon: 'success',
      confirmButtonText: 'OK',
    }).then(() => {
      window.location.reload();
    });
    
    await makeApiCall(newStatus, card.id);
  };

  const makeApiCall = async (status: any, cardId: any) => {
    try {
      await axios.put(`http://localhost:3001/projects/stage/${projectId}/${cardId}`, {
        status: status,
      });
    } catch (error) {
      console.error('Failed to update the stage status:', error);
    }
  };

  useEffect(() => {
    localStorage.setItem('lastPage', window.location.href);

    const lastPage = localStorage.getItem('lastPage');
    if (lastPage) {
      window.history.replaceState(null, '', lastPage);
    }
  }, []);

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mt: 2 }}>
        <Board
          initialBoard={board}
          onCardDragEnd={handleCardDrag}
          renderCard={(card: any) => {
            const getCardColor = (status: string) => {
              switch (status) {
                case 'ongoing':
                  return 'rgba(255, 165, 0, 0.5)'; // Orange for ongoing 
                case 'completed':
                  return 'rgba(0, 128, 0, 0.5)'; // Green for completed 
                case 'incomplete':
                  return 'rgba(128, 128, 128, 0.5)'; // Grey for incomplete 
                default:
                  return 'white';
              }
            };

            return (
              <Box
                key={card.id} // Ensure unique key here
                sx={{
                  margin: '10px',
                  marginLeft: '75px',
                  marginRight: '75px',
                  padding: '15px',
                  width: '200px',
                  height: '180px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  backgroundColor: getCardColor(card.status), 
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)', 
                  },
                }}
              >
                <Typography variant="h6" sx={{ mb: 1, fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center' }}>
                  {card.title}
                </Typography>
                <Box
                  component="div"
                  sx={{
                    textDecoration: 'none',
                    marginTop: '5px',
                    borderRadius: '4px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    width: '100%',
                    textAlign: 'center',
                    fontSize: '20px',
                    padding: '10px',
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <a href={card.fileUrl} download style={{ color: '#1976d2', textDecoration: 'none' }}>
                    Download
                  </a>
                </Box>
              </Box>
            );
          }}
        />
      </Box>
    </Container>
  );
  
};

export default DownloadPage;
