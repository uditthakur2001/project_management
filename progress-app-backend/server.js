const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

const projectsFilePath = path.join(__dirname, 'data', 'projects.json');
const downloadsFilePath = path.join(__dirname, 'data', 'downloads.json');

// Get all projects
app.get('/projects', (req, res) => {
  fs.readFile(projectsFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading projects data');
    }
    res.json(JSON.parse(data)); 
  });
});

// Get a specific project by ID
app.get('/projects/:projectId', (req, res) => {
  const projectId = parseInt(req.params.projectId, 10);

  fs.readFile(projectsFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading projects data');
    }

    const projects = JSON.parse(data);
    const project = projects.find(p => p.projectId === projectId);

    if (project) {
      res.json(project); 
    } else {
      res.status(404).send('Project not found');
    }
  });
});

// Add a new project with stages from downloads.json
app.post('/projects', (req, res) => {
  const newProject = req.body;
  if (!newProject || !newProject.projectName) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  fs.readFile(projectsFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading projects');
    }

    let projects = JSON.parse(data);
    const exists = projects.some(p => p.projectName.toLowerCase() === newProject.projectName.toLowerCase());

    if (exists) {
      return res.status(409).json({ error: 'Project name already exists' });
    }

    newProject.projectId = projects.length > 0 ? projects[projects.length - 1].projectId + 1 : 1;

    // Read stages from downloads.json
    fs.readFile(downloadsFilePath, 'utf-8', (err, downloadData) => {
      if (err) {
        return res.status(500).send('Error reading downloads');
      }

      const downloads = JSON.parse(downloadData);
      
      // Add all stages from downloads to the new project
      newProject.stages = downloads.map(download => ({
        id: download.id, // Ensure unique ID logic if needed
        name: download.name,
        fileUrl: download.fileUrl,
        status: "incomplete", // Default status
      }));

      projects.push(newProject);

      fs.writeFile(projectsFilePath, JSON.stringify(projects, null, 2), (err) => {
        if (err) {
          return res.status(500).send('Error saving projects');
        }
        res.json(newProject);
      });
    });
  });
});

// Remove a project by ID
app.delete('/projects/:id', (req, res) => {
  const projectId = parseInt(req.params.id);

  fs.readFile(projectsFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading projects');
    }

    let projects = JSON.parse(data);
    projects = projects.filter(project => project.projectId !== projectId);

    fs.writeFile(projectsFilePath, JSON.stringify(projects, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error saving projects');
      }
      res.json(projects); 
    });
  });
});

// Add a new stage to a project
app.post('/projects/stage/:projectId', (req, res) => {
  const projectId = parseInt(req.params.projectId, 10); 
  const stageData = req.body;

  if (!stageData || !stageData.name) {
    return res.status(400).json({ error: 'Stage data is required' });
  }

  fs.readFile(projectsFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading projects data');
    }

    const projects = JSON.parse(data);
    const project = projects.find(p => p.projectId === projectId); 

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const newStage = {
      id: project.stages.length > 0 ? project.stages[project.stages.length - 1].id + 1 : 1,
      ...stageData,
      status: "incomplete" // Default status
    };
    project.stages.push(newStage);

    fs.writeFile(projectsFilePath, JSON.stringify(projects, null, 2), (err) => {
      if (err) {
        console.error('Error saving projects file:', err);
        return res.status(500).send('Error saving data');
      }
      res.status(201).json(newStage); 
    });
  });
});

// Change the status of a stage
app.put('/projects/stage/:projectId/:id', (req, res) => {
  const projectId = parseInt(req.params.projectId, 10);
  const stageId = parseInt(req.params.id, 10);
  const { status } = req.body;

  fs.readFile(projectsFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading projects data');
    }

    const projects = JSON.parse(data);
    const project = projects.find(p => p.projectId === projectId);
    if (!project) return res.status(404).send('Project not found');

    const stage = project.stages.find(s => s.id === stageId);
    if (!stage) return res.status(404).send('Stage not found');

    stage.status = status; 

    fs.writeFile(projectsFilePath, JSON.stringify(projects, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error saving data');
      }
      res.json(stage); 
    });
  });
});

// Delete a stage from a project
app.delete('/projects/stage/:projectId/:id', (req, res) => {
  const projectId = parseInt(req.params.projectId, 10);
  const stageId = parseInt(req.params.id, 10);

  fs.readFile(projectsFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading projects data');
    }

    const projects = JSON.parse(data);
    const project = projects.find(p => p.projectId === projectId);
    if (!project) return res.status(404).send('Project not found');

    project.stages = project.stages.filter(s => s.id !== stageId);

    fs.writeFile(projectsFilePath, JSON.stringify(projects, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error saving data');
      }
      res.json(project.stages);
    });
  });
});

// Get all downloads
app.get('/downloads', (req, res) => {
  fs.readFile(downloadsFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading downloads');
    }
    res.json(JSON.parse(data));
  });
});

// Add a new download and update projects
app.post('/downloads', (req, res) => {
  const newDownload = req.body;

  fs.readFile(downloadsFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading downloads');
    }

    let downloads = JSON.parse(data);
    newDownload.id = downloads.length > 0 ? downloads[downloads.length - 1].id + 1 : 1; 
    downloads.push(newDownload);

    fs.writeFile(downloadsFilePath, JSON.stringify(downloads, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error saving downloads');
      }

      fs.readFile(projectsFilePath, 'utf-8', (err, projectData) => {
        if (err) {
          return res.status(500).send('Error reading projects');
        }

        const projects = JSON.parse(projectData);
        projects.forEach(project => {
          project.stages.push({
            id: newDownload.id,
            name: newDownload.name,
            fileUrl: newDownload.fileUrl,
            status: "incomplete", // Set a default status
          });
        });

        fs.writeFile(projectsFilePath, JSON.stringify(projects, null, 2), (err) => {
          if (err) {
            return res.status(500).send('Error saving projects');
          }
          res.json(downloads); 
        });
      });
    });
  });
});

// Remove a download by ID
app.delete('/downloads/:id', (req, res) => {
  const downloadId = parseInt(req.params.id);

  fs.readFile(downloadsFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading downloads');
    }

    let downloads = JSON.parse(data);
    downloads = downloads.filter(download => download.id !== downloadId);

    fs.writeFile(downloadsFilePath, JSON.stringify(downloads, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error saving downloads');
      }
      res.json(downloads); 
    });
  });
});


// Update stages in a project for reorder
app.put('/reorder/:projectId', (req, res) => {
  const projectId = parseInt(req.params.projectId, 10);
  const updatedStages = req.body.stages; 

  fs.readFile(projectsFilePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).send('Error reading projects data');

    const projects = JSON.parse(data);
    const project = projects.find(p => p.projectId === projectId);
    
    if (!project) return res.status(404).send('Project not found');

    project.stages = updatedStages;

    fs.writeFile(projectsFilePath, JSON.stringify(projects, null, 2), (err) => {
      if (err) return res.status(500).send('Error saving data');
      res.json(project.stages); 
    });
  });
});




app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
