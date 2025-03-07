import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:8000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      // Check for non-200 response status
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Login failed");
      }

      const data = await response.json();

      // Handle specific department-related error
      if (
        data.message ===
        "Invalid credentials. User does not belong to this department"
      ) {
        return rejectWithValue(
          "Invalid credentials. User does not belong to this department"
        );
      }

      // If login is successful, store the user data and token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      // Catch network errors or other exceptions
      return rejectWithValue(err.message || "An error occurred");
    }
  }
);

const initialState = {
  users: JSON.parse(localStorage.getItem("user")) || [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Add reducers here
    logout(state) {
      state.users = [];
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = usersSlice.actions;
export default usersSlice.reducer;
