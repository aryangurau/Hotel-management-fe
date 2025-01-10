import { Table, Modal, Form, Button } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from 'moment';
import { useState } from 'react';

import {
  decreaseQuantity,
  increaseQuantity,
  removeItem,
  removeAll,
} from "../slices/cartSlice";
import { createOrder } from "../slices/orderSlice";
import Payment from '../components/Payment';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '',
    totalAmount: 0
  });

  const resetBookingData = () => {
    setBookingData({
      checkIn: '',
      checkOut: '',
      guests: '',
      totalAmount: 0
    });
  };

  const handleShowBooking = (item) => {
    setSelectedItem(item);
    setBookingData(prev => ({
      ...prev,
      guests: '',
      totalAmount: 0
    }));
    setShowBookingModal(true);
  };

  const handleProceedToPayment = () => {
    if (!bookingData.checkIn || !bookingData.checkOut || !bookingData.guests) {
      toast.error('Please fill in all required fields');
      return;
    }

    const checkIn = moment(bookingData.checkIn);
    const checkOut = moment(bookingData.checkOut);
    const guestsNum = parseInt(bookingData.guests);
    
    if (!checkIn.isValid() || !checkOut.isValid()) {
      toast.error('Please enter valid dates');
      return;
    }

    if (checkIn.isBefore(moment(), 'day')) {
      toast.error('Check-in date cannot be in the past');
      return;
    }

    if (checkOut.isSameOrBefore(checkIn)) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    if (!guestsNum || guestsNum < 1 || guestsNum > (selectedItem?.maxGuests || 1)) {
      toast.error(`Please select between 1 and ${selectedItem?.maxGuests || 1} guests`);
      return;
    }

    const numberOfDays = checkOut.diff(checkIn, 'days');
    const totalAmount = numberOfDays * (selectedItem?.price || 0);
    
    setBookingData(prev => ({
      ...prev,
      totalAmount,
      numberOfDays
    }));

    setShowBookingModal(false);
    setShowPaymentModal(true);
  };

  const handleBookNow = (item) => {
    handleShowBooking(item);
  };

  const handlePaymentSuccess = async () => {
    try {
      const orderData = {
        items: [{
          roomId: selectedItem.id || selectedItem._id,
          quantity: selectedItem.quantity || 1,
          price: selectedItem.price,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guests: parseInt(bookingData.guests)
        }],
        totalAmount: bookingData.totalAmount,
        paymentDetails: {
          method: "cash",
          status: "paid",
          paidAt: new Date().toISOString()
        }
      };

      // Create order first
      const result = await dispatch(createOrder(orderData)).unwrap();
      
      if (result) {
        // If order creation was successful, remove from cart
        await dispatch(removeItem(selectedItem.id || selectedItem._id));
        
        // Store the name before clearing selectedItem
        const roomName = selectedItem.name;
        
        // Clean up state
        setShowPaymentModal(false);
        resetBookingData();
        setSelectedItem(null);
        
        toast.success(`Successfully booked ${roomName}!`);
        navigate("/my-bookings");
      } else {
        throw new Error("Failed to create booking");
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || "Failed to create booking");
      // Don't remove from cart or clean up state if booking failed
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

      {/* Booking Modal */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Check-in Date</Form.Label>
              <Form.Control
                type="date"
                min={moment().format('YYYY-MM-DD')}
                value={bookingData.checkIn}
                onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Check-out Date</Form.Label>
              <Form.Control
                type="date"
                min={moment(bookingData.checkIn || moment()).add(1, 'days').format('YYYY-MM-DD')}
                value={bookingData.checkOut}
                onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Number of Guests</Form.Label>
              <div className="d-flex align-items-center">
                <Button 
                  variant="outline-secondary"
                  type="button"
                  onClick={() => {
                    const currentGuests = parseInt(bookingData.guests) || 0;
                    if (currentGuests > 0) {
                      setBookingData(prev => ({ ...prev, guests: (currentGuests - 1).toString() }));
                    }
                  }}
                  disabled={!bookingData.guests || parseInt(bookingData.guests) <= 0}
                >
                  -
                </Button>
                <Form.Control
                  type="text"
                  value={bookingData.guests}
                  style={{ width: '60px', textAlign: 'center', margin: '0 10px' }}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= (selectedItem?.maxGuests || 1))) {
                      setBookingData(prev => ({ ...prev, guests: value }));
                    }
                  }}
                />
                <Button 
                  variant="outline-secondary"
                  type="button"
                  onClick={() => {
                    const currentGuests = parseInt(bookingData.guests) || 0;
                    if (currentGuests < (selectedItem?.maxGuests || 1)) {
                      setBookingData(prev => ({ ...prev, guests: (currentGuests + 1).toString() }));
                    }
                  }}
                  disabled={bookingData.guests !== '' && parseInt(bookingData.guests) >= (selectedItem?.maxGuests || 1)}
                >
                  +
                </Button>
              </div>
              <Form.Text className="text-muted">
                Maximum {selectedItem?.maxGuests || 1} guests allowed
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleProceedToPayment}>
            Proceed to Payment
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Payment Modal */}
      {showPaymentModal && (
        <Payment
          show={showPaymentModal}
          handleClose={() => {
            setShowPaymentModal(false);
            resetBookingData();
            setSelectedItem(null);
          }}
          selectedRoom={selectedItem}
          bookingDetails={bookingData}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};

export default Cart;
