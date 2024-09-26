// File: types.ts

export interface Stage {
    id: number;
    name: string;
    fileUrl: string;
    status: 'ongoing' | 'completed' | 'incomplete';
    projectId: number; // Ensure projectId is included
  }
  
  export interface Project {
    projectId: number;
    projectName: string;
    stages: Stage[]; // Project contains an array of Stage objects
  }
  
export interface RootState {
  download: {
    stages: Stage[]; // Adjust this to match your state structure
  };
  // Add other slices if you have them
}
