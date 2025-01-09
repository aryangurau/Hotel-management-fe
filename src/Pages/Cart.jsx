import { Table } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  decreaseQuantity,
  increaseQuantity,
  removeItem,
  removeAll,
} from "../slices/cartSlice";
import { createOrder } from "../slices/orderSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);

  const handleBookNow = async (item) => {
    try {
      const orderData = {
        items: [{
          roomId: item.id || item._id,
          quantity: item.quantity || 1,
          price: item.price
        }],
        totalAmount: item.price * (item.quantity || 1),
        paymentDetails: {
          method: "cash",
          status: "paid"
        }
      };

      const result = await dispatch(createOrder(orderData)).unwrap();
      if (result) {
        toast.success(`Successfully booked ${item.name}!`);
        dispatch(removeItem(item.id || item._id));
        navigate("/my-bookings");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create booking");
    }
  };

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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.length > 0 ? (
                cart.map((item) => (
                  <tr key={item.id || item._id}>
                    <td>{item.id || item._id}</td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.totalGuests}</td>
                    <td>
                      <span
                        className="btn btn-sm btn-danger m-1"
                        onClick={() =>
                          dispatch(decreaseQuantity({ id: item.id || item._id }))
                        }
                      >
                        -
                      </span>
                      <span className="btn btn-light">{item.quantity || 1}</span>
                      <span
                        className="btn btn-sm btn-danger m-1"
                        onClick={() =>
                          dispatch(increaseQuantity({ id: item.id || item._id }))
                        }
                      >
                        +
                      </span>
                    </td>
                    <td>{item.price * (item.quantity || 1)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleBookNow(item)}
                        >
                          Book Now
                        </button>
                        <span
                          className="btn btn-sm btn-danger"
                          onClick={() => dispatch(removeItem(item.id || item._id))}
                        >
                          <FaTrashAlt size="1rem" />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
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
