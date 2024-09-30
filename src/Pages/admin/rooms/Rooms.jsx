import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Form } from "react-bootstrap";
import { TbEdit, TbTrash } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";

import Paginate from "../../../Components/Paginate";
import AddButton from "../../../Components/AddButton";
import TableLoader from "../../../Components/TableLoader";

import { listRooms, removeRoom } from "../../../slices/roomSlice";

const AdminRooms = () => {
  const dispatch = useDispatch();
  const { rooms, currentPage, limit, loading } = useSelector(
    (state) => state.rooms
  );

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
              className="form-inline "
              style={{ width: "10px" }}
              onChange={(e) => setSearchStatus(e.target.value)}
              size="sm"
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
                <TableLoader />
                <TableLoader />
                <TableLoader />
              </>
            )}

            {!loading && rooms && rooms.length > 0 ? (
              rooms.map((room, idx) => {
                return (
                  <tr key={room?._id}>
                    <th scope="row">{idx + 1}</th>
                    <td>{room?.name}</td>
                    <td>{room?.type}</td>
                    <td>{room?.price}</td>
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
                      <div className="btn-group me-2" role="button">
                        <Link to={`/admin/rooms/${room?._id}`}>
                          <TbEdit className="text-primary" />
                        </Link>
                      </div>
                      <div
                        className="btn-group"
                        role="button"
                        onClick={() => dispatch(removeRoom(room?.name))}
                      >
                        <TbTrash className="text-danger" />
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Paginate />
      </div>
    </>
  );
};

export default AdminRooms;