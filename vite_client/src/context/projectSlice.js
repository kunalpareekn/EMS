import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
    name:"project",
    initialState:{
        allProjects:[],
    },
    reducers:{
        // actions
        setAllProjects:(state,action) => {
                console.log("Dispatched projects:", action.payload); // ✅ Add this
            state.allProjects = action.payload;
        },
    }
});
export const {setAllProjects} = projectSlice.actions;
export default projectSlice.reducer;