import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import RoomServices from "../services/rooms";

const initialState = {
  rooms: [],
  room: {},
  total: 0,
  currentPage: 1,
  limit: 10,
  error: "",
  loading: false,
};

export const listRooms = createAsyncThunk(
  "rooms/listRooms",
  async ({ limit, page, name, status }) => {
    const res = await RoomServices.list({ limit, page, status, name });
    return res.data;
  }
);

export const createRoom = createAsyncThunk(
  "rooms/createRoom",
  async (payload) => {
    const res = await RoomServices.create(payload);
    return res.data;
  }
);

export const getRoomById = createAsyncThunk("rooms/getRoomById", async (id) => {
  const res = await RoomServices.getRoomById(id);
  return res.data;
});

export const updateRoom = createAsyncThunk(
  "rooms/updateRoom",
  async ({ id, payload }) => {
    const res = await RoomServices.updateRoom(id, payload);
    return res.data;
  }
);

export const updateRoomStatus = createAsyncThunk(
  "rooms/updateRoomStatus",
  async ({ id, payload }) => {
    const res = await RoomServices.updateRoomStatus(id, payload);
    return res.data;
  }
);

export const removeRoom = createAsyncThunk("rooms/removeRoom", async (id) => {
  const res = await RoomServices.removeRoom(id);
  return res.data;
});

const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // List rooms
      .addCase(listRooms.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(listRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(listRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create room
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = [...state.rooms, action.payload];
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Get room by id
      .addCase(getRoomById.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getRoomById.fulfilled, (state, action) => {
        state.loading = false;
        state.room = action.payload;
      })
      .addCase(getRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update room
      .addCase(updateRoom.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = state.rooms.map((room) =>
          room._id === action.payload._id ? action.payload : room
        );
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update room status
      .addCase(updateRoomStatus.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateRoomStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = state.rooms.map((room) =>
          room._id === action.payload._id ? action.payload : room
        );
      })
      .addCase(updateRoomStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Remove room
      .addCase(removeRoom.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(removeRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = state.rooms.filter(
          (room) => room._id !== action.payload._id
        );
      })
      .addCase(removeRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setCurrentPage, setLimit } = roomSlice.actions;

export default roomSlice.reducer;
