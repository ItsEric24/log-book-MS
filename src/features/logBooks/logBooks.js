import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchLogBooks = createAsyncThunk(
  "logbooks/fetchLogBooks",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8000/api/logbooks/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch logbooks. Please try again.");
      }

      const logbookData = await response.json();
      return logbookData.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  logBooks: [],
  error: false,
  loading: false,
};

const logBookSlice = createSlice({
  name: "logbook",
  initialState,
  reducers: {
    // Add reducers here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.logBooks = action.payload;
      })
      .addCase(fetchLogBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export default logBookSlice.reducer
