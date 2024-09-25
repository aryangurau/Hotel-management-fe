
import { Dropdown } from "react-bootstrap";

import Paginate from "../../Components/Paginate";
import AddButton from "../../Components/AddButton";

const AdminOrders = () => {
  return (
    <>
      <div className="col-md-9 m-5">
        <h1>List</h1>
        <AddButton text="Add new Order" variant="danger" />
        <div className="d-flex">
          <div className="input-group mt-3 mb-3">
            <Dropdown>
              <Dropdown.Toggle variant="danger">Status</Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Booked</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Empty</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Occupied</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name..."
            />
          </div>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Number</th>
              <th scope="col">Type</th>
              <th scope="col">Price (NPR)</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>101</td>
              <td>Single</td>
              <td>2000</td>
              <td>
                <span className="badge text-bg-success">Occupied</span>
              </td>
              <td>
                <div className="btn-group me-2" role="button">
                  <i className="bi bi-pencil-square text-success"></i>
                </div>
                <div className="btn-group" role="button">
                  <i className="bi bi-trash text-danger"></i>
                </div>
              </td>
            </tr>
            <tr className="placeholder-glow">
              <th scope="row">
                <span className="placeholder col-6"></span>
              </th>
              <td>
                <span className="placeholder col-6"></span>
              </td>
              <td>
                <span className="placeholder col-6"></span>
              </td>
              <td>
                <span className="placeholder col-6"></span>
              </td>
              <td>
                <span className="placeholder col-6"></span>
              </td>
              <td>
                <div className="btn-group me-2" role="button">
                  <i className="bi bi-pencil-square text-success"></i>
                </div>
                <div className="btn-group" role="button">
                  <i className="bi bi-trash text-danger"></i>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <Paginate />
      </div>
    </>
  );
};

export default AdminOrders;
