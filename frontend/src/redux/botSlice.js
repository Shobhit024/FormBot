import { createSlice } from "@reduxjs/toolkit";

export const botSlice = createSlice({
  name: "botName",
  initialState: {
    data: (() => {
      try {
        return JSON.parse(localStorage.getItem("storeBot")) || {};
      } catch (error) {
        console.error("Failed to parse localStorage data:", error);
        return {};
      }
    })(),
  },
  reducers: {
    setBot: (state, action) => {
      try {
        const serializedData = JSON.stringify(action.payload);
        localStorage.setItem("storeBot", serializedData);
      } catch (error) {
        console.error("Failed to save data to localStorage:", error);
      }
      state.data = action.payload;
    },
  },
});

export const { setBot } = botSlice.actions;
export default botSlice.reducer;
