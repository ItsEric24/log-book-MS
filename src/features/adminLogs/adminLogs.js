import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAdminLogBooks = createAsyncThunk(
  "adminlogbooks/fetchAdminLogBooks",
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8000/api/logbooks/admin/logbooks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch logbooks. Please try again.");
      }

      const adminLogbookData = await response.json();
      return adminLogbookData.data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  adminLogs: [],
  error: false,
  loading: false,
};

const adminLogSlice = createSlice({
  name: "adminLog",
  initialState,
  reducers: {
    // Add reducers here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminLogBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminLogBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.adminLogs = action.payload;
      })
      .addCase(fetchAdminLogBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export default adminLogSlice.reducer
