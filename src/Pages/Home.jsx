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
import './css/home.css';
import './css/modal.css';

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

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchResults, setSearchResults] = useState(null);
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [bookingDetails, setBookingDetails] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1
  });

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
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const handleAddToCart = (room) => {
    dispatch(addToCart(room));
    toast.success('Added to cart successfully!');
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleBookingSubmit = () => {
    // Implement booking submission logic
    console.log('Booking submitted:', { selectedRoom, bookingDetails });
    setShowBookingModal(false);
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
    return ROOM_IMAGES[type.toLowerCase()] || ROOM_IMAGES.single;
  };

  return (
    <div className="home-container">
      <Banner />
      
      {/* Rooms Section */}
      <Container className='available-hotels'>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Available Rooms</h2>
          {searchResults && (
            <div>
              <Button variant="outline-secondary" onClick={() => setSearchResults(null)} className="me-2">
                <FaSearch className="me-2" />
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
                          src={getRoomImages(room.type)[0]}
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
                  src={getRoomImages(selectedRoom.type)[0]}
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

      {/* Booking Modal */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book Room - {selectedRoom?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Check-in Date</Form.Label>
              <Form.Control
                type="date"
                value={bookingDetails.checkIn}
                onChange={(e) =>
                  setBookingDetails({ ...bookingDetails, checkIn: e.target.value })
                }
                min={new Date().toISOString().split('T')[0]}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Check-out Date</Form.Label>
              <Form.Control
                type="date"
                value={bookingDetails.checkOut}
                onChange={(e) =>
                  setBookingDetails({ ...bookingDetails, checkOut: e.target.value })
                }
                min={bookingDetails.checkIn || new Date().toISOString().split('T')[0]}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Number of Guests</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max={selectedRoom?.totalGuests || 1}
                value={bookingDetails.guests}
                onChange={(e) =>
                  setBookingDetails({ ...bookingDetails, guests: parseInt(e.target.value) })
                }
              />
              <Form.Text className="text-muted">
                Maximum {selectedRoom?.totalGuests} guests allowed
              </Form.Text>
            </Form.Group>
          </Form>
          {selectedRoom && (
            <div className="mt-4 p-3 bg-light rounded">
              <h6>Booking Summary</h6>
              <div className="d-flex justify-content-between mb-2">
                <span>Room Rate:</span>
                <span>Rs. {selectedRoom.price}/night</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Room Type:</span>
                <span>{selectedRoom.type.charAt(0).toUpperCase() + selectedRoom.type.slice(1)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Max Guests:</span>
                <span>{selectedRoom.totalGuests}</span>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={handleBookingSubmit}
            disabled={!bookingDetails.checkIn || !bookingDetails.checkOut || bookingDetails.guests < 1}
          >
            Confirm Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
