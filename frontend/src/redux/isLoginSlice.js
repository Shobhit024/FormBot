import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    storeIsLoggedIn: (state, action) => {
      if (typeof action.payload === "boolean") {
        state.isLoggedIn = action.payload;
      } else {
        console.error("Invalid payload: Expected a boolean");
      }
    },
  },
});

export const { storeIsLoggedIn } = loginSlice.actions;
export default loginSlice.reducer;
