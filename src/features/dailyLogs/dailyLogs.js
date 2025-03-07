import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchDailyLogs = createAsyncThunk(
  "dailyLogs/fetchDailyLogs",
  async ({token, id}, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/daily-logs/${id}`,
        {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
        },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch daily logs. Please try again.");
      }

      const dailyData = await response.json();
      return dailyData.data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const initialState = {
    dailyLogs: [],
    loading: false,
    error: null,
};


const dailyLogsSlice = createSlice({
    name: "dailyLog",
    initialState,
    reducers: {
        // Add reducers here
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDailyLogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDailyLogs.fulfilled, (state, action) => {
                state.loading = false;
                state.dailyLogs = action.payload;
            })
            .addCase(fetchDailyLogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default dailyLogsSlice.reducer;
