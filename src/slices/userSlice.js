import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../Utils/axiosInstance";
import { URLS } from "../Constants";
import { getToken } from "../Utils/session";

const config = {
  headers: {
    access_token: getToken(),
  },
};

// List Users
export const listUsers = createAsyncThunk(
  "users/list",
  async ({ page = 1, limit = 10, name = "", isBlocked = "", isActive = "" }) => {
    try {
      console.log("Fetching users with params:", { page, limit, name, isBlocked, isActive });
      const response = await axiosInstance.get(
        `${URLS.USERS}?page=${page}&limit=${limit}&name=${name}&isBlocked=${isBlocked}&isActive=${isActive}`,
        config
      );
      console.log("Users API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error.response || error);
      throw error;
    }
  }
);

// Block/Unblock User
export const blockUser = createAsyncThunk(
  "users/block",
  async ({ email, updated_by }) => {
    try {
      console.log("Blocking/Unblocking user:", email);
      const response = await axiosInstance.patch(
        `${URLS.USERS}/block/${email}`,
        { updated_by },
        config
      );
      return response.data;
    } catch (error) {
      console.error("Error blocking/unblocking user:", error.response || error);
      throw error;
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  "users/resetPassword",
  async ({ email, newPassword, updated_by }) => {
    try {
      console.log("Resetting password for user:", email);
      const response = await axiosInstance.put(
        `${URLS.USERS}/resetPassword`,
        { email, newPassword, updated_by },
        config
      );
      return response.data;
    } catch (error) {
      console.error("Error resetting password:", error.response || error);
      throw error;
    }
  }
);

// Delete User
export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`${URLS.USERS}/${userId}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to delete user');
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    totalUsers: 0,
    loading: false,
    error: null,
    actionLoading: false,
    actionError: null,
  },
  reducers: {
    clearActionError: (state) => {
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // List Users
      .addCase(listUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listUsers.fulfilled, (state, action) => {
        state.loading = false;
        const responseData = action.payload?.data;
        
        if (responseData?.data && Array.isArray(responseData.data)) {
          state.users = responseData.data;
          state.totalUsers = responseData.metadata?.[0]?.total || 0;
        } else {
          state.users = [];
          state.totalUsers = 0;
        }
        state.error = null;
      })
      .addCase(listUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.users = [];
        state.totalUsers = 0;
      })
      // Block User
      .addCase(blockUser.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(blockUser.fulfilled, (state) => {
        state.actionLoading = false;
        state.actionError = null;
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.error.message;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.actionLoading = false;
        state.actionError = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.error.message;
      })
      // Delete user cases
      .addCase(deleteUser.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.users = state.users.filter(user => user._id !== action.meta.arg);
        state.totalUsers = state.totalUsers - 1;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });
  },
});

export const { clearActionError } = userSlice.actions;
export default userSlice.reducer;
