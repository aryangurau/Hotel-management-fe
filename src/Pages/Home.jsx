import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Form, Row, Col, Pagination, Nav, Container, Card, Alert } from 'react-bootstrap';
import { FaWifi, FaParking, FaSwimmingPool, FaUtensils, FaMountain, FaSpa, FaShoppingCart, FaSearch, FaBed, FaUsers } from 'react-icons/fa';
import { useFetch } from "../hooks/useFetch";
import { URLS } from "../Constants";
import { Notify } from "../components/Notify";
import { useNavigate, useLocation } from 'react-router-dom';
import { isLoggedIn } from '../Utils/login';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import Banner from '../components/Banner';
import Payment from '../Components/Payment';
import './css/home.css';
import './css/modal.css';
import moment from 'moment';
import { getCurrentUser } from '../Utils/session';
import { createOrder } from '../slices/orderSlice';

const ROOM_CATEGORIES = {
  SINGLE: "Single Rooms",
  DOUBLE: "Double Rooms",
  SUITE: "Suite Rooms"
};

const ROOM_IMAGES = {
  single: [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  ],
  double: [
    'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80'
  ],
  suite: [
    'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  ]
};

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchResults, setSearchResults] = useState(null);
  const [searchParams, setSearchParams] = useState({
    roomType: '',
    price: '',
    guests: ''
  });
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    totalAmount: 0
  });

  const resetBookingData = () => {
    setBookingData({
      checkIn: '',
      checkOut: '',
      guests: 1,
      totalAmount: 0
    });
  };

  const handleShowBooking = (room) => {
    setSelectedRoom(room);
    setBookingData(prev => ({
      ...prev,
      guests: 1,
      totalAmount: 0
    }));
    setShowBookingModal(true);
  };

  const { data: rooms, loading, error } = useFetch({ url: "/rooms/public" });

  useEffect(() => {
    console.log('Rooms data:', rooms);
    console.log('Loading:', loading);
    console.log('Error:', error);
  }, [rooms, loading, error]);

  const navigate = useNavigate();

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
    // Validate form data
    if (!bookingData.checkIn || !bookingData.checkOut || !bookingData.guests) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate dates
    const checkIn = moment(bookingData.checkIn);
    const checkOut = moment(bookingData.checkOut);
    
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

    // Validate guest count
    if (!bookingData.guests || bookingData.guests < 1 || bookingData.guests > (selectedRoom?.maxGuests || 1)) {
      toast.error(`Please select between 1 and ${selectedRoom?.maxGuests || 1} guests`);
      return;
    }

    // Calculate number of days and total amount
    const numberOfDays = checkOut.diff(checkIn, 'days');
    const totalAmount = numberOfDays * (selectedRoom?.price || 0);
    
    // Update booking data
    setBookingData(prev => ({
      ...prev,
      totalAmount,
      numberOfDays
    }));

    setShowBookingModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      const user = getCurrentUser();
      if (!user || !user._id) {
        throw new Error('Please login to make a booking');
      }

      const orderData = {
        roomId: selectedRoom._id,
        userId: user._id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: parseInt(bookingData.guests),
        totalAmount: bookingData.totalAmount,
        paymentMethod: paymentData.paymentMethod,
        guestName: paymentData.guestName,
        phoneNumber: paymentData.phoneNumber,
        status: "confirmed",
        paymentDetails: {
          status: "paid",
          paidAt: new Date().toISOString()
        }
      };

      // Create the booking
      const result = await dispatch(createOrder(orderData)).unwrap();
      
      if (result) {
        toast.success('Booking confirmed successfully!');
        resetBookingData();
        setShowPaymentModal(false);
        setSelectedRoom(null);
        navigate('/booking-history');
      } else {
        throw new Error('Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Failed to create booking');
      setShowPaymentModal(false);
    }
  };

  const handleSearch = (searchParams) => {
    if (!rooms?.data) return;

    let results = Array.isArray(rooms.data) ? rooms.data : [];
    
    // Filter by room type
    if (searchParams.type) {
      results = results.filter(room => 
        room.type.toLowerCase() === searchParams.type.toLowerCase()
      );
    }

    // Filter by price
    if (searchParams.priceRange) {
      const [min, max] = searchParams.priceRange.split('-').map(p => parseInt(p));
      results = results.filter(room => 
        room.price >= min && room.price <= max
      );
    }

    // Filter by number of guests
    if (searchParams.guests) {
      const guests = parseInt(searchParams.guests);
      results = results.filter(room => 
        room.totalGuests >= guests
      );
    }

    setSearchResults(results);
    setCurrentPage(1); // Reset to first page when searching
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
    if (searchResults) {
      filtered = searchResults;
    }
    return filtered;
  }, [rooms?.data, selectedCategory, searchResults]);

  // Get current rooms for pagination
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  useEffect(() => {
    console.log('Current Rooms:', currentRooms);
  }, [currentRooms]);

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
    const images = ROOM_IMAGES[type.toLowerCase()] || ROOM_IMAGES.single;
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  return (
    <div className="home-container">
      <Banner onSearch={handleSearch} />
      
      {/* Rooms Section */}
      <div className='available-rooms'>
      <Container className=''>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Available Rooms</h2>
          {searchResults && (
            <div>
              <Button variant="outline-secondary" onClick={() => setSearchResults(null)} className="me-2">
                Clear Search
              </Button>
              <span className="text-muted">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </span>
            </div>
          )}
        </div>

        {/* Category Navigation */}
        <Nav
          variant="pills" 
          className="my-4 justify-content-center flex-wrap nav-booking "
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

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : currentRooms.length === 0 ? (
          <div className="text-center my-5">
            <h4>No rooms available at the moment</h4>
            <p className="text-muted">Please check back later or try different filters</p>
          </div>
        ) : (
          <>
            <Row className="g-4">
              {currentRooms.map((room, index) => (
                <Col key={room._id || index} xs={12} md={6} lg={4}>
                  <Card className="h-100 room-card">
                    <Card.Header className="bg-transparent border-0 pt-3 px-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">{room.name}</h5>
                        <span className="badge bg-primary">Rs. {room.price}/night</span>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <div className="room-image-container mb-3">
                        <img
                          className="w-100 room-image"
                          src={getRoomImages(room.type)}
                          alt={room.name}
                        />
                      </div>
                      <div className="mb-3">
                        <small className="text-muted">
                          <FaUsers className="me-1" />
                          Max Guests: {room.totalGuests} · 
                          {getRoomTypeIcon(room.type)}
                          Room Type: {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                        </small>
                      </div>
                      <Card.Text>
                        A comfortable {room.type} room with modern amenities, perfect for your stay.
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className="bg-transparent">
                      <div className="d-flex justify-content-between">
                        <Button
                          variant="outline-primary"
                          onClick={() => handleShowDetails(room)}
                        >
                          Details
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => handleBookNow(room)}
                          disabled={room.status !== 'empty'}
                        >
                          {room.status === 'empty' ? 'Book Now' : 'Not Available'}
                        </Button>
                        <Button
                          variant="outline-success"
                          onClick={() => handleAddToCart(room)}
                          disabled={room.status !== 'empty'}
                        >
                          <FaShoppingCart />
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            {pageNumbers.length > 1 && (
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
            )}
          </>
        )}
      </Container>
</div>
      {/* Room Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedRoom?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRoom && (
            <>
              <div className="room-image-container mb-4">
                <img
                  className="w-100 room-image"
                  src={getRoomImages(selectedRoom.type)}
                  alt={selectedRoom.name}
                />
              </div>
              <div className="mt-4">
                <h5>Room Details</h5>
                <p>
                  Experience comfort and luxury in our {selectedRoom.type} room. 
                  Perfect for {selectedRoom.type === 'single' ? 'solo travelers' : 
                    selectedRoom.type === 'double' ? 'couples or friends' : 
                    'families or luxury seekers'}.
                </p>
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Price:</strong> Rs. {selectedRoom.price}/night</p>
                    <p>
                      <strong>Room Type:</strong> {' '}
                      {selectedRoom.type.charAt(0).toUpperCase() + selectedRoom.type.slice(1)}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Max Guests:</strong> {selectedRoom.totalGuests}</p>
                    <p>
                      <strong>Status:</strong> {' '}
                      {selectedRoom.status === 'empty' ? 'Available' : 'Not Available'}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowModal(false);
              handleBookNow(selectedRoom);
            }}
            disabled={selectedRoom?.status !== 'empty'}
          >
            {selectedRoom?.status === 'empty' ? 'Book Now' : 'Not Available'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Payment Modal */}
      <Payment 
        show={showPaymentModal}
        handleClose={() => setShowPaymentModal(false)}
        amount={bookingData.totalAmount}
        selectedRoom={selectedRoom}
        bookingDetails={bookingData}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Booking Modal */}
      <Modal show={showBookingModal} onHide={() => {
        setShowBookingModal(false);
        resetBookingData();
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Book Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            e.preventDefault();
            handleProceedToPayment();
          }}>
            <Form.Group className="mb-3">
              <Form.Label>Check-in Date <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="date"
                value={bookingData.checkIn}
                min={moment().format('YYYY-MM-DD')}
                onChange={(e) => setBookingData(prev => ({ ...prev, checkIn: e.target.value }))}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Check-out Date <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="date"
                value={bookingData.checkOut}
                min={bookingData.checkIn ? moment(bookingData.checkIn).add(1, 'days').format('YYYY-MM-DD') : moment().add(1, 'days').format('YYYY-MM-DD')}
                onChange={(e) => setBookingData(prev => ({ ...prev, checkOut: e.target.value }))}
                required
                disabled={!bookingData.checkIn}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Number of Guests <span className="text-danger">*</span></Form.Label>
              <div className="d-flex align-items-center">
                <Button 
                  variant="outline-secondary" 
                  type="button"
                  onClick={() => {
                    if (bookingData.guests > 1) {
                      setBookingData(prev => ({ ...prev, guests: prev.guests - 1 }));
                    }
                  }}
                  disabled={bookingData.guests <= 1}
                >
                  -
                </Button>
                <Form.Control
                  type="number"
                  min={1}
                  max={selectedRoom?.maxGuests || 1}
                  value={bookingData.guests}
                  style={{ width: '60px', textAlign: 'center', margin: '0 10px' }}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 1 && value <= (selectedRoom?.maxGuests || 1)) {
                      setBookingData(prev => ({ ...prev, guests: value }));
                    }
                  }}
                  required
                />
                <Button 
                  variant="outline-secondary"
                  type="button"
                  onClick={() => {
                    if (bookingData.guests < (selectedRoom?.maxGuests || 1)) {
                      setBookingData(prev => ({ ...prev, guests: prev.guests + 1 }));
                    }
                  }}
                  disabled={bookingData.guests >= (selectedRoom?.maxGuests || 1)}
                >
                  +
                </Button>
              </div>
              <Form.Text className="text-muted">
                Maximum {selectedRoom?.maxGuests || 1} guests allowed
              </Form.Text>
            </Form.Group>

            <div className="booking-summary mt-4">
              <h5>Booking Summary</h5>
              <p>Room Rate: Rs. {selectedRoom?.price}/night</p>
              <p>Room Type: {selectedRoom?.type}</p>
              <p>Max Guests: {selectedRoom?.maxGuests}</p>
            </div>

            <div className="d-grid gap-2">
              <Button 
                variant="primary" 
                type="submit"
                disabled={!bookingData.checkIn || !bookingData.checkOut || !bookingData.guests || bookingData.guests < 1 || bookingData.guests > (selectedRoom?.maxGuests || 1)}
              >
                Proceed to Payment
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Home;
