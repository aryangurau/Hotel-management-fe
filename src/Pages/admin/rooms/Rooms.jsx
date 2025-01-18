import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Form } from "react-bootstrap";
import { TbEdit, TbTrash } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

import Paginate from "../../../Components/Paginate";
import AddButton from "../../../Components/AddButton";
import TableLoader from "../../../Components/TableLoader";

import { listRooms, removeRoom } from "../../../slices/roomSlice";

// Memoized selector
const selectRoomState = createSelector(
  [(state) => state.rooms || {}],
  (rooms) => ({
    rooms: rooms.rooms || [],
    currentPage: rooms.currentPage || 1,
    limit: rooms.limit || 10,
    loading: rooms.loading || false,
    total: rooms.total || 0
  })
);

const AdminRooms = () => {
  const dispatch = useDispatch();
  const { rooms, currentPage, limit, loading, total } = useSelector(selectRoomState);

  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const initFetch = useCallback(() => {
    dispatch(
      listRooms({
        page: currentPage,
        limit: limit,
        name: searchName,
        status: searchStatus,
      })
    );
  }, [currentPage, dispatch, limit, searchName, searchStatus]);

  useEffect(() => {
    initFetch();
  }, [initFetch]);

  const handleDelete = useCallback((roomId) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      dispatch(removeRoom(roomId)).then(() => {
        initFetch();
      });
    }
  }, [dispatch, initFetch]);

  const handlePageChange = useCallback((page) => {
    dispatch(
      listRooms({
        page,
        limit,
        name: searchName,
        status: searchStatus,
      })
    );
  }, [dispatch, limit, searchName, searchStatus]);

  return (
    <>
      <div className="col-md-9 m-5">
        <h1>List</h1>
        <AddButton
          text="Add new Room"
          variant="danger"
          url="/admin/rooms/create"
        />
        <div className="d-flex">
          <div className="input-group mt-3 mb-3">
            <Form.Select
              className="form-inline"
              style={{ width: "10px" }}
              onChange={(e) => setSearchStatus(e.target.value)}
              size="sm"
              value={searchStatus}
            >
              <option value="">Select Status</option>
              <option value="booked">Booked</option>
              <option value="empty">Empty</option>
              <option value="occupied">Occupied</option>
            </Form.Select>
            <input
              style={{ width: "500px" }}
              type="text"
              className="form-control"
              placeholder="Search by name..."
              onChange={(e) => setSearchName(e.target.value)}
              value={searchName}
            />
          </div>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col">Price (NPR)</th>
              <th scope="col">No. of Guests</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <>
                <TableLoader key="loader-1" />
                <TableLoader key="loader-2" />
                <TableLoader key="loader-3" />
              </>
            )}

            {!loading && rooms.length > 0 ? (
              rooms.map((room, idx) => (
                <tr key={room?._id}>
                  <th scope="row">{((currentPage - 1) * limit) + idx + 1}</th>
                  <td>{room?.name}</td>
                  <td>{room?.type}</td>
                  <td>{room?.price?.toLocaleString()}</td>
                  <td>{room?.totalGuests}</td>
                  <td>
                    <span
                      className={`badge text-bg-${
                        room?.status === "empty" ? "success" : "warning"
                      }`}
                    >
                      {room?.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link
                        to={`/admin/rooms/edit/${room?._id}`}
                        className="btn btn-sm btn-primary"
                      >
                        <TbEdit />
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(room?._id)}
                      >
                        <TbTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              !loading && (
                <tr>
                  <td colSpan="7" className="text-center">
                    No rooms found
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {!loading && total > 0 && (
          <div className="d-flex justify-content-end mt-4">
            <Paginate
              currentPage={currentPage}
              totalPages={Math.ceil(total / limit)}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AdminRooms;