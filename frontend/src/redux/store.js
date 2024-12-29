import { configureStore } from "@reduxjs/toolkit";
import botReducer from "./botSlice";

import loginReducer from "/src/redux/isLoginSlice.js";

import botUpdateReducer from "./botUpdateSlice";

export default configureStore({
  reducer: {
    bot: botReducer,
    login: loginReducer,
    botUpdate: botUpdateReducer,
  },
});
