
import { Table } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  decreaseQuantity,
  increaseQuantity,
  removeItem,
  removeAll,
} from "../slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  return (
    <>
      <h1 className="text-center m-5">Your Cart</h1>
      <div className="row justify-content-center">
        <div className="col-md-9 m-1">
          <div className="d-flex flex-row-reverse">
            <button
              className="btn btn-danger"
              onClick={() => dispatch(removeAll())}
            >
              Remove All
            </button>
          </div>
        </div>
        <div className="col-md-9">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>Max Guest</th>
                <th># Rooms</th>
                <th>Total Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.length > 0 ? (
                cart.map((item, idx) => {
                  return (
                    <tr key={item?._id}>
                      <td>{idx + 1}</td>
                      <td>{item?.name}</td>
                      <td>{item?.price}</td>
                      <td>{item?.totalGuests}</td>
                      <td>
                        <span
                          className="btn btn-sm btn-danger m-1"
                          onClick={() =>
                            dispatch(decreaseQuantity({ _id: item?._id }))
                          }
                        >
                          -
                        </span>
                        <span className="btn btn-light">{item?.quantity}</span>
                        <span
                          className="btn btn-sm btn-danger m-1"
                          onClick={() =>
                            dispatch(increaseQuantity({ _id: item?._id }))
                          }
                        >
                          +
                        </span>
                      </td>
                      <td>{item?.price * item?.quantity}</td>
                      <td>
                        <span
                          className="btn btn-sm btn-danger m-1"
                          onClick={() => dispatch(removeItem(item?._id))}
                        >
                          <FaTrashAlt size="1rem" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No items found.&nbsp;
                    <Link
                      to="/booking"
                      className="link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                    >
                      Continue Shopping
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default Cart;
