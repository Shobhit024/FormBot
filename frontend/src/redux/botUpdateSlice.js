import { createSlice } from "@reduxjs/toolkit";

export const botUpdateSlice = createSlice({
  name: "botUpdate",
  initialState: {
    updateData: {},
  },
  reducers: {
    setBotUpdate: (state, action) => {
      if (typeof action.payload === "object" && action.payload !== null) {
        state.updateData = action.payload;
      } else {
        console.error("Invalid payload: Expected an object");
      }
    },
  },
});

export const { setBotUpdate } = botUpdateSlice.actions;
export default botUpdateSlice.reducer;
