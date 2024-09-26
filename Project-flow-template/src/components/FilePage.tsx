import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
} from "@mui/material";

interface FileItem {
  id: number;
  name: string;
  description: string;
  fileUrl?: string; // Ensure this is the URL for downloading the file
  url?: string;
}

const FilePage: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("http://localhost:3001/downloads");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: FileItem[] = await response.json();
        setFiles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading files...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Download Documents
      </Typography>
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        gap={4} 
      >
        {files.map((item) => (
          <Box
            key={item.id} 
            sx={{ minWidth: "250px"}} 
          >
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: 2,
                height: "150px",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              {" "}
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  component="a"
                  href={item.fileUrl || item.url}
                  download={item.name} 
                >
                  Download
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default FilePage;
