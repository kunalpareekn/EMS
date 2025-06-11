// projectSlice.js
import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "project",
  initialState: {
    allProjects: [],
  },
  reducers: {
    // Set entire projects array
    setAllProjects: (state, action) => {
      console.log("Dispatched projects:", action.payload);
      state.allProjects = action.payload;
    },

    // Add a single new project
    addProject: (state, action) => {
      console.log("Added project:", action.payload);
      const normalizedProject = {
        ...action.payload,
        projectLeader: Array.isArray(action.payload.projectLeader)
          ? action.payload.projectLeader.map(p => p._id)
          : [action.payload.projectLeader._id],
        projectMembers: action.payload.projectMembers.map(member => member._id),
      };
      state.allProjects.unshift(normalizedProject);
    },

    // Update a project
    updateProject: (state, action) => {
      console.log("Updated project:", action.payload);
      const { _id } = action.payload;
      const index = state.allProjects.findIndex(project => project._id === _id);
      if (index !== -1) {
        const normalizedProject = {
          ...action.payload,
          projectLeader: Array.isArray(action.payload.projectLeader)
            ? action.payload.projectLeader.map(p => p._id)
            : [action.payload.projectLeader._id],
          projectMembers: action.payload.projectMembers.map(member => member._id),
        };
        state.allProjects[index] = normalizedProject;
      }
    },

    // Delete a project
    deleteProject: (state, action) => {
      console.log("Deleted project ID:", action.payload);
      state.allProjects = state.allProjects.filter(
        project => project._id !== action.payload
      );
    },
  },
});

export const { 
  setAllProjects, 
  addProject,
  updateProject,
  deleteProject 
} = projectSlice.actions;
export default projectSlice.reducer;