import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../config';
import { toast } from 'react-toastify';

const initialState = {
  users: [],
  loading: false,
  error: null,
  success: false,
  actionLoading: false,
  actionError: null,
  totalUsers: 0,
  currentPage: 1,
  limit: 10
};

// List users
export const listUsers = createAsyncThunk(
  'user/listUsers',
  async ({ page, limit, name, isActive, isBlocked }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        params: {
          page,
          limit,
          name,
          isActive,
          isBlocked
        }
      };

      const { data } = await axios.get(`${API_URL}/users`, config);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Block/Unblock user
export const blockUser = createAsyncThunk(
  'user/blockUser',
  async ({ email, updated_by }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/users/${email}/block`,
        { updated_by },
        config
      );

      toast.success('User status updated successfully');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Reset password
export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ email, newPassword, updated_by }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/users/${email}/reset-password`,
        { newPassword, updated_by },
        config
      );

      toast.success('Password reset successfully');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Update profile
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/users/profile`,
        userData,
        config
      );

      toast.success('Profile updated successfully');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Get profile
export const getProfile = createAsyncThunk(
  'user/getProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };

      const { data } = await axios.get(`${API_URL}/users/profile`, config);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearActionError: (state) => {
      state.actionError = null;
    }
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
        state.users = action.payload.data;
        state.totalUsers = action.payload.total;
        state.error = null;
      })
      .addCase(listUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
        state.actionError = action.payload;
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
        state.actionError = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUserState, clearActionError } = userSlice.actions;
export default userSlice.reducer;
