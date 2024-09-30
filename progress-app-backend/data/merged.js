const fs = require('fs');

// Function to add a new download and update projects
const addDownloadAndUpdateProjects = (newDownload) => {
  const downloadsFilePath = './downloads.json'; 
  const projectsFilePath = './projects.json'; 

  // Read and parse downloads.json
  const downloadsData = JSON.parse(fs.readFileSync(downloadsFilePath, 'utf8'));
  const projectsData = JSON.parse(fs.readFileSync(projectsFilePath, 'utf8'));

  // Add new download to downloads.json
  downloadsData.push(newDownload);
  fs.writeFileSync(downloadsFilePath, JSON.stringify(downloadsData, null, 2));

  // Update each project in projects.json
  projectsData.forEach(project => {
    // Add the new download as a stage in each project
    project.stages.push({
      id: newDownload.id,
      name: newDownload.name,
      fileUrl: newDownload.fileUrl,
      status: "incomplete", // Set a default status
    });
  });

  fs.writeFileSync(projectsFilePath, JSON.stringify(projectsData, null, 2));
};

// Function to add a new project with all stages from downloads.json
const addNewProjectWithStages = (newProject) => {
  const downloadsFilePath = './downloads.json';
  const projectsFilePath = './projects.json';

  const downloadsData = JSON.parse(fs.readFileSync(downloadsFilePath, 'utf8'));
  const projectsData = JSON.parse(fs.readFileSync(projectsFilePath, 'utf8'));

  // Add new project
  newProject.projectId = projectsData.length > 0 ? projectsData[projectsData.length - 1].projectId + 1 : 1;
  newProject.stages = downloadsData.map(download => ({
    id: download.id,
    name: download.name,
    fileUrl: download.fileUrl,
    status: "incomplete" // Default status
  }));

  projectsData.push(newProject);

  // Write updated projects back to projects.json
  fs.writeFileSync(projectsFilePath, JSON.stringify(projectsData, null, 2));
};

const newDownload = {
  id: 11,
  name: "New Project Document",
  description: "Download Document",
  fileUrl: "/files/new_project_document.docx"
};

addDownloadAndUpdateProjects(newDownload);

const newProject = {
  projectName: "New Project",
  description: "This is a new project"
};

addNewProjectWithStages(newProject);
