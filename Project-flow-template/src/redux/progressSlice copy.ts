import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Stage {
  id: number;
  name: string;
  description: string;
  fileUrl?: string; // Make fileUrl optional
  status: string;  
}

interface StagesState {
  stages: Stage[];
}

const initialState: StagesState = {
  stages: [],
};

const stagesSlice = createSlice({
  name: 'stages',
  initialState,
  reducers: {
    setStages(state, action: PayloadAction<Stage[]>) {
      state.stages = action.payload;
    },
    newStage(state, action: PayloadAction<Stage>) {
      state.stages.push(action.payload);
    },
    removeStage(state, action: PayloadAction<number>) {
      state.stages = state.stages.filter(stage => stage.id !== action.payload);
    },
    updateStageStatus(state, action: PayloadAction<{ id: number; status: string }>) {
      const stage = state.stages.find(stage => stage.id === action.payload.id);
      if (stage) {
        stage.status = action.payload.status; // Update the status
      }
    },
  },
});

export const { setStages, newStage, removeStage, updateStageStatus } = stagesSlice.actions;
export default stagesSlice.reducer;
