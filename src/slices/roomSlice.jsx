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
      state.currentPage = 1;
      state.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.total = action.payload.data.total;
        state.rooms = action.payload.data.data;
      })
      .addCase(listRooms.pending, (state) => {
        state.loading = true;
        state.rooms = [];
        state.total = 0;
      })
      .addCase(listRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(removeRoom.fulfilled, (state, action) => {
        state.loading = false;
        const remaningRooms = state.rooms.filter(
          (room) => room?.name !== action.meta.arg
        );
        state.rooms = remaningRooms;
        state.total--;
      })
      .addCase(removeRoom.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setCurrentPage, setLimit } = roomSlice.actions;
export const roomReducer = roomSlice.reducer;