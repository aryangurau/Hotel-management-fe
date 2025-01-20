import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Form, Row, Col, Pagination, Nav, Container, Card, Alert } from 'react-bootstrap';
import { FaWifi, FaParking, FaSwimmingPool, FaUtensils, FaMountain, FaSpa, FaShoppingCart, FaSearch, FaBed, FaUsers } from 'react-icons/fa';
import { useFetch } from "../hooks/useFetch";
import { URLS } from "../Constants";
import { Notify } from "../components/Notify";
import { useNavigate, useLocation } from 'react-router-dom'; // Update import
import { isLoggedIn } from '../Utils/login';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import Payment from '../Components/Payment';
import moment from 'moment';

const ROOM_CATEGORIES = {
  SINGLE: "Single Rooms",
  DOUBLE: "Double Rooms",
  SUITE: "Suite Rooms"
};

const ROOM_IMAGES = {
  single: [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304",
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf"
  ],
  double: [
    "https://images.unsplash.com/photo-1590490360182-c33d57733427",
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf"
  ],
  suite: [
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
    "https://images.unsplash.com/photo-1631049552057-403cdb8f0658"
  ]
};

const Booking = () => {
  const [showModal, setShowModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
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

  const handleShowBooking = (room) => {
    setSelectedRoom(room);
    setBookingData(prev => ({
      ...prev,
      guests: '',
      totalAmount: 0
    }));
    setShowBookingModal(true);
  };

  const { data: rooms, loading, error } = useFetch({ url: "/rooms/public" });

  const handleShowDetails = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handleBookNow = (room) => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    handleShowBooking(room);
  };

  const handleAddToCart = (room) => {
    dispatch(addToCart(room));
    toast.success('Added to cart successfully!');
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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

    if (!guestsNum || guestsNum < 1 || guestsNum > (selectedRoom?.maxGuests || 1)) {
      toast.error(`Please select between 1 and ${selectedRoom?.maxGuests || 1} guests`);
      return;
    }

    const numberOfDays = checkOut.diff(checkIn, 'days');
    const totalAmount = numberOfDays * (selectedRoom?.price || 0);
    
    setBookingData(prev => ({
      ...prev,
      totalAmount,
      numberOfDays
    }));

    setShowBookingModal(false);
    setShowPaymentModal(true);
  };

  const handleGuestChange = (type) => {
    const currentGuests = parseInt(bookingData.guests) || 0;
    let newGuests = currentGuests;

    if (type === 'increment' && (currentGuests < (selectedRoom?.maxGuests || 1))) {
      newGuests = currentGuests + 1;
    } else if (type === 'decrement' && currentGuests > 0) {
      newGuests = currentGuests - 1;
    }

    setBookingData(prev => ({ ...prev, guests: newGuests.toString() }));
  };

  // Filter rooms based on selected category
  const filteredRooms = useMemo(() => {
    if (!rooms?.data) {
      return [];
    }
    let filtered = Array.isArray(rooms.data) ? rooms.data : [];
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(room => 
        room.type && room.type.toUpperCase() === selectedCategory
      );
    }
    return filtered;
  }, [rooms?.data, selectedCategory]);

  // Get current rooms for pagination
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  // Calculate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredRooms.length / roomsPerPage); i++) {
    pageNumbers.push(i);
  }

  const getRoomTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'single': return <FaBed className="me-1" />;
      case 'double': return <FaBed className="me-1" />;
      case 'suite': return <FaBed className="me-1" />;
      default: return null;
    }
  };

  const getRoomImages = (type) => {
    return ROOM_IMAGES[type.toLowerCase()] || ROOM_IMAGES.single;
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Available Rooms</h2>
      </div>

      {/* Category Navigation */}
      <Nav
        variant="pills" 
        className="my-4 justify-content-center flex-wrap nav-booking"
        activeKey={selectedCategory}
        onSelect={(category) => setSelectedCategory(category)}
      >
        <Nav.Item>
          <Nav.Link eventKey="all">All Rooms</Nav.Link>
        </Nav.Item>
        {Object.entries(ROOM_CATEGORIES).map(([key, value]) => (
          <Nav.Item key={key}>
            <Nav.Link eventKey={key}>{value}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {/* Professional Notice */}
      <div className="booking-notice mb-4">
        <Alert variant="light" className="text-center border shadow-sm py-3">
          <div className="d-flex align-items-center justify-content-center">
            <div className="notice-icon me-3">
              <FaShoppingCart size={24} className="text-primary" />
            </div>
            <div className="notice-content">
              <h6 className="mb-1 fw-bold">Booking Process</h6>
              <p className="mb-0 text-muted">
                To ensure a smooth booking experience, please add your desired rooms to the cart first.
              </p>
            </div>
          </div>
        </Alert>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <Alert variant="danger">Error loading rooms: {error.message}</Alert>
      ) : (
        <>
          <Row>
            {currentRooms.map((room) => (
              <Col key={room._id} xs={12} className="mb-4">
                <Card className="hotel-card h-100">
                  <Row className="g-0">
                    <Col md={4}>
                      <div className="hotel-image-wrapper h-100">
                        <Card.Img
                          src={getRoomImages(room.type)[0]}
                          className="hotel-image h-100"
                          alt={room.name}
                          style={{ objectFit: 'cover' }}
                        />
                        <div className={`category-ribbon ${room.type.toLowerCase()}-hotels`}>
                          {getRoomTypeIcon(room.type)} {room.type}
                        </div>
                      </div>
                    </Col>
                    <Col md={8}>
                      <Card.Body className="d-flex flex-column h-100">
                        <div>
                          <Card.Title className="h4 mb-3">{room.name}</Card.Title>
                          <Card.Text className="text-muted mb-3">
                            A comfortable {room.type.toLowerCase()} room with modern amenities, perfect for your stay.
                          </Card.Text>
                          <div className="hotel-features mb-3">
                            <span className="feature-badge">
                              <FaUsers /> Max {room.maxGuests} guests
                            </span>
                            {room.amenities?.map((amenity, index) => (
                              <span key={index} className="feature-badge">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="hotel-price">
                              ${room.price} <span className="price-period">/night</span>
                            </div>
                            <div className="d-flex gap-2">
                              <Button variant="outline-primary" onClick={() => handleShowDetails(room)}>
                                Details
                              </Button>
                              <Button variant="primary" onClick={() => handleBookNow(room)}>
                                Book Now
                              </Button>
                              <Button variant="outline-secondary" onClick={() => handleAddToCart(room)}>
                                <FaShoppingCart />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              {pageNumbers.map((number) => (
                <Pagination.Item
                  key={number}
                  active={number === currentPage}
                  onClick={() => handlePageChange(number)}
                >
                  {number}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </>
      )}

      {/* Room Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedRoom?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRoom && (
            <>
              <div className="room-images mb-4">
                <img
                  src={getRoomImages(selectedRoom.type)[0]}
                  alt={selectedRoom.name}
                  className="w-100 rounded"
                  style={{ maxHeight: '300px', objectFit: 'cover' }}
                />
              </div>
              <h5>Room Details</h5>
              <p>{selectedRoom.description}</p>
              <div className="room-features mt-3">
                <h6>Amenities:</h6>
                <div className="d-flex flex-wrap gap-2">
                  {selectedRoom.amenities?.map((amenity, index) => (
                    <span key={index} className="feature-badge">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-3">
                <h6>Price: ${selectedRoom.price}/night</h6>
                <p>Maximum Guests: {selectedRoom.maxGuests}</p>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            setShowModal(false);
            handleBookNow(selectedRoom);
          }}>
            Book Now
          </Button>
        </Modal.Footer>
      </Modal>

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
                  onClick={() => handleGuestChange('decrement')}
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
                    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= (selectedRoom?.maxGuests || 1))) {
                      setBookingData(prev => ({ ...prev, guests: value }));
                    }
                  }}
                />
                <Button 
                  variant="outline-secondary"
                  type="button"
                  onClick={() => handleGuestChange('increment')}
                  disabled={bookingData.guests !== '' && parseInt(bookingData.guests) >= (selectedRoom?.maxGuests || 1)}
                >
                  +
                </Button>
              </div>
              <Form.Text className="text-muted">
                Maximum {selectedRoom?.maxGuests || 1} guests allowed
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
          }}
          selectedRoom={selectedRoom}
          bookingDetails={bookingData}
        />
      )}
    </Container>
  );
};

export default Booking;