import React, { useEffect, useState } from "react";
import {Typography, Container, Box, Select, MenuItem, FormControl, Badge} from "@mui/material";
import axios from "axios";
import { Stage } from "../types";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Swal from 'sweetalert2';

interface DownloadPageProps {
  projectId: number;
  projectName: string;
  stages: Stage[];
  isAdmin: boolean;
}

const DownloadPage: React.FC<DownloadPageProps> = ({
  projectId,
  stages: initialStages,
  isAdmin,
}) => {
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const columns = 6; // Set the number of columns

  const getCardColor = (status: "ongoing" | "completed" | "incomplete") => {
    switch (status) {
      case "ongoing":
        return "rgba(255, 165, 0, 0.5)"; // Orange
      case "completed":
        return "rgba(0, 128, 0, 0.5)"; // Green
      case "incomplete":
        return "rgba(128, 128, 128, 0.5)"; // Grey
      default:
        return "white";
    }
  };

  const handleStatusChange = async (
    stageId: number,
    status: "ongoing" | "completed" | "incomplete"
  ) => {
    if (!isAdmin) {
      await Swal.fire({
        icon: 'warning',
        title: 'Access Denied',
        text: 'Only admins can change the status.',
      });
      return;
    }

    const updatedStages = stages.map((stage) => {
      if (stage.id === stageId) {
        return { ...stage, status };
      }
      return stage;
    });

    setStages(updatedStages);
    await makeApiCall(status, stageId);
  };

  const makeApiCall = async (
    status: "ongoing" | "completed" | "incomplete",
    cardId: number
  ) => {
    await axios.put(
      `http://localhost:3001/projects/stage/${projectId}/${cardId}`,
      { status }
    );
  };
  
  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    if (!isAdmin) {
      await Swal.fire({
        icon: 'warning',
        title: 'Access Denied',
        text: 'Only admins can rearrange the stages.',
      });
      return;
    }

    const reorderedStages = Array.from(stages);
    const [movedStage] = reorderedStages.splice(result.source.index, 1);
    reorderedStages.splice(result.destination.index, 0, movedStage);

    setStages(reorderedStages);
    await makeApiCall(movedStage.status, movedStage.id);
  };

  useEffect(() => {
    localStorage.setItem("lastPage", window.location.href);
    const lastPage = localStorage.getItem("lastPage");
    if (lastPage) {
      window.history.replaceState(null, "", lastPage);
    }
  }, []);

  return (
    <Container>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="stages" direction="horizontal" >
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                position: "relative",
                mt: 2,
                gap: 1,
              }}
            >
              {Array.from({ length: Math.ceil(stages.length / columns) }).map((_, rowIndex) => {
                const start = rowIndex * columns;
                const end = start + columns;
                const rowStages = stages.slice(start, end);

                // Reverse the order for every second row
                const displayedStages = rowIndex % 2 === 0 ? rowStages : rowStages.reverse();

                return (
                  <Box
                    key={rowIndex}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: rowIndex % 2 === 0 ? "flex-start" : "flex-end", 
                      marginLeft: rowIndex === 1 ? "30px" : "0", 
                      width: "100%", 
                    }}
                  >
                    {displayedStages.map((stage, index) => {
                      const isLastInRow = (index + 1) === displayedStages.length;

                      // Calculate the overall index for the badge, reverse for the second row
                      const overallIndex = start + (rowIndex % 2 === 0 ? index : (rowStages.length - 1 - index));

                      return (
                        <React.Fragment key={stage.id}>
                          <Draggable draggableId={stage.id.toString()} index={start + index}>
                            {(provided) => (
                              <Box
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  flexDirection: "column",
                                  width: "150px",
                                }}
                              >
                                <Box sx={{ marginTop: "50px", minWidth: "120px" }}>
                                  <FormControl fullWidth>
                                    <Select
                                      sx={{
                                        fontSize: "small",
                                        width: "120px",
                                        height: "25px",
                                        backgroundColor: getCardColor(stage.status),
                                        marginBottom: '15px'
                                      }}
                                      value={stage.status}
                                      onChange={(e) =>
                                        handleStatusChange(
                                          stage.id,
                                          e.target.value as "ongoing" | "completed" | "incomplete"
                                        )
                                      }
                                    >
                                      <MenuItem value="ongoing">Ongoing</MenuItem>
                                      <MenuItem value="completed">Completed</MenuItem>
                                      <MenuItem value="incomplete">Not Started</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Box>
                                <Badge
                    badgeContent={overallIndex + 1} 
                    color="primary"
                    sx={{ marginBottom: "5px" }}
                  >
                                  <Box
                                    sx={{
                                      padding: "15px",
                                      width: "150px",
                                      height: "80px",
                                      borderRadius: "8px",
                                      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                                      backgroundColor: getCardColor(stage.status),
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      transition: "transform 0.2s",
                                      "&:hover": {
                                        transform: "scale(1.05)",
                                      },
                                    }}
                                  >
                                    <Typography variant="body1">
                                      {stage.name}
                                    </Typography>
                                  </Box>
                                </Badge>
                              </Box>
                            )}
                          </Draggable>
                          {/* Arrow connecting the stages */}
                          {(index < displayedStages.length - 1) && (
                            <Typography
                              variant="h4"
                              sx={{
                                margin: "8px",
                                alignSelf: "center",
                                // display: isLastInRow ? 'none' : 'flex',
                                transform: `translateY(30px) ${rowIndex % 2 === 0 ? 'rotate(0deg)' : 'rotate(180deg)'}`, 
                              }}
                            >
                              &rarr;
                            </Typography>
                          )}
                          {/* Vertical arrow for new row connection */}
                          {(index === displayedStages.length - 1 && rowIndex < Math.floor(stages.length / columns)) && (end < stages.length) &&  (
                            <Typography
                              variant="h4"
                              sx={{
                                margin: "5px",
                                alignSelf: "center",
                                transform: `${rowIndex % 2 === 0 ? 'translate(-85px, 110px)' : 'translate(-1095px, 110px)'}`, 
                              }}
                            >
                              &#8595; 
                            </Typography>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </Box>
                );
              })}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
};

export default DownloadPage;
