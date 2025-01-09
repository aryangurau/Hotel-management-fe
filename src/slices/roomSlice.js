import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import RoomServices from "../services/rooms";

export const listRooms = createAsyncThunk(
  "rooms/list",
  async ({ page = 1, limit = 10, name = "", status = "" } = {}) => {
    try {
      console.log("Fetching rooms with params:", { page, limit, name, status });
      const response = await RoomServices.list({ page, limit, name, status });
      console.log("Rooms API response:", response);
      // Return the entire response to handle in the reducer
      return response.data;
    } catch (error) {
      console.error("Error fetching rooms:", error.response || error);
      throw error;
    }
  }
);

export const createRoom = createAsyncThunk(
  "rooms/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await RoomServices.create(payload);
      
      // Check if response exists
      if (!response?.data) {
        return rejectWithValue('No response data received');
      }

      // Check for error message in response
      if (response.data.msg && !response.data.data) {
        return rejectWithValue(response.data.msg);
      }

      return response.data.data;
    } catch (error) {
      console.error('Error in createRoom thunk:', error);
      return rejectWithValue(error.message || 'Failed to create room');
    }
  }
);

export const updateRoom = createAsyncThunk(
  "rooms/update",
  async ({ id, payload }) => {
    const response = await RoomServices.updateRoom(id, payload);
    return response.data;
  }
);

export const removeRoom = createAsyncThunk(
  "rooms/remove",
  async (id) => {
    const response = await RoomServices.removeRoom(id);
    return response.data;
  }
);

const initialState = {
  rooms: [],
  currentPage: 1,
  limit: 10,
  loading: false,
  error: null
};

const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // List Rooms
      .addCase(listRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Loading rooms...");
      })
      .addCase(listRooms.fulfilled, (state, action) => {
        console.log("Rooms fetched successfully:", action.payload);
        state.loading = false;
        
        // The API returns { data: { data: [...rooms] }, msg: string }
        if (action.payload?.data?.data && Array.isArray(action.payload.data.data)) {
          state.rooms = action.payload.data.data;
        } else if (action.payload?.data && Array.isArray(action.payload.data)) {
          state.rooms = action.payload.data;
        } else if (Array.isArray(action.payload)) {
          state.rooms = action.payload;
        } else {
          console.warn("Unexpected data structure:", action.payload);
          state.rooms = [];
        }
        
        state.error = null;
        console.log("Updated rooms state:", state.rooms);
      })
      .addCase(listRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.rooms = [];
        console.error("Failed to fetch rooms:", action.error);
      })
      // Create Room
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Add the new room to the list if it exists
        if (action.payload) {
          state.rooms = [...state.rooms, action.payload];
        }
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Update Room
      .addCase(updateRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoom.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Remove Room
      .addCase(removeRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeRoom.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setPage } = roomSlice.actions;
export default roomSlice.reducer;
