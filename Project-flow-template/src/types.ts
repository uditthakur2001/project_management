// File: types.ts

export interface Stage {
    id: number;
    name: string;
    fileUrl: string;
    status: 'ongoing' | 'completed' | 'incomplete';
    projectId: number; // Ensure projectId is included
  }
  
  export interface Project {
    projectId: number; // or number, depending on your backend
    projectName: string;
    stages: Stage[]; // Define a more specific type if possible
  }
  
  
export interface RootState {
  download: {
    stages: Stage[]; // Adjust this to match your state structure
  };
  // Add other slices if you have them
}
