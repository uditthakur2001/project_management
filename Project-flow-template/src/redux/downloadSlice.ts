// File: src/redux/downloadSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Download {
  id: number;
  name: string;
  description: string;
  fileUrl: string;
}

interface Stage {
  id: number;
  name: string;
  fileUrl: string;
  status: 'ongoing' | 'completed' | 'incomplete'; // Make sure to include 'incomplete' if it's used in your stages
  projectId?: number; // Optional projectId for filtering stages

}

interface DownloadsState {
  downloads: Download[];
  stages: Stage[]; // Separate stages array
}

const initialState: DownloadsState = {
  downloads: [],
  stages: [], // Initialize stages
};

const downloadsSlice = createSlice({
  name: 'downloads',
  initialState,
  reducers: {
    setDownloads: (state, action: PayloadAction<Download[]>) => {
      state.downloads = action.payload;
    },
    setStages: (state, action: PayloadAction<Stage[]>) => {
      state.stages = action.payload; // Saving stages in a separate array
    },
    updateStageStatus(state, action: PayloadAction<Stage[]>) {
      state.stages = action.payload; // Update stages with the new status
    },
  },
});

// Export actions
export const { setDownloads, setStages, updateStageStatus } = downloadsSlice.actions;
export default downloadsSlice.reducer;
