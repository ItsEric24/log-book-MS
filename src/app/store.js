import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/users/users';
import dailyLogsReducer from '../features/dailyLogs/dailyLogs';
import logBookReducer from "../features/logBooks/logBooks"
import adminLogReducer from "../features/adminLogs/adminLogs"


const store = configureStore({
    reducer: {
        user: userReducer,
        dailyLog: dailyLogsReducer,
        logbook: logBookReducer,
        adminLog: adminLogReducer
    },
});

export default store;