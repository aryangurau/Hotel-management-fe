import { useState } from "react";
import { Col, Row, Pagination, Nav, Container, Alert } from "react-bootstrap";
import { useFetch } from "../hooks/useFetch";
import { URLS } from "../Constants";
import { CardPlaceholder } from "../Components/Placeholders";
import { Notify } from "../components/Notify";
import { Cards } from "../components/Card";
import Payment from "../Components/Payment";
import { useDispatch } from "react-redux";
import { createBooking } from "../slices/bookingSlice";
import { useNavigate } from "react-router-dom";

const ROOM_CATEGORIES = {
  SINGLE: "Single Rooms",
  DOUBLE: "Double Rooms",
  SUITE: "Suite Rooms"
};

const ROOM_IMAGES = {
  single: {
    main: {
      url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304",
      caption: "Single Room"
    },
    room: {
      url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf",
      caption: "Comfortable Single Room"
    },
    view: {
      url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf",
      caption: "Room View"
    }
  },
  double: {
    main: {
      url: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
      caption: "Double Room"
    },
    room: {
      url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf",
      caption: "Spacious Double Room"
    },
    view: {
      url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf",
      caption: "Room View"
    }
  },
  suite: {
    main: {
      url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
      caption: "Luxury Suite"
    },
    room: {
      url: "https://images.unsplash.com/photo-1631049552057-403cdb8f0658",
      caption: "Suite Living Area"
    },
    view: {
      url: "https://images.unsplash.com/photo-1631049552057-403cdb8f0658",
      caption: "Suite View"
    }
  }
};

const getRoomImages = (type) => {
  return ROOM_IMAGES[type?.toLowerCase()] || ROOM_IMAGES.single;
};

const getAmenitiesByType = (type) => {
  const baseAmenities = ["Wi-Fi", "TV", "AC"];
  
  switch(type?.toLowerCase()) {
    case 'single':
      return [...baseAmenities, "Work Desk"];
    case 'double':
      return [...baseAmenities, "Mini Bar", "Lounge Area"];
    case 'suite':
      return [...baseAmenities, "Living Room", "Kitchen", "Private Balcony", "Jacuzzi"];
    default:
      return baseAmenities;
  }
};

const Booking = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(6);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const dispatch = useDispatch();

  const { data: apiResponse, loading, error } = useFetch({ url: "/rooms/public" });

  // Transform API data to match our component's requirements
  const rooms = apiResponse?.data?.map(room => ({
    _id: room._id,
    name: `${room.type} Room ${room.roomNumber || ''}`.trim(),
    type: room.type,
    price: room.price || (
      room.type?.toLowerCase() === 'single' ? 2000 :
      room.type?.toLowerCase() === 'double' ? 3500 :
      room.type?.toLowerCase() === 'suite' ? 5000 : 2500
    ),
    status: room.status,
    maxGuests: room.totalGuests || (
      room.type?.toLowerCase() === 'single' ? 1 :
      room.type?.toLowerCase() === 'double' ? 2 : 4
    ),
    images: getRoomImages(room.type),
    amenities: getAmenitiesByType(room.type),
    description: `Experience comfort in our ${room.type?.toLowerCase()} room, perfect for ${
      room.type?.toLowerCase() === 'single' ? 'solo travelers' :
      room.type?.toLowerCase() === 'double' ? 'couples or friends' :
      'families and luxury seekers'
    }.`,
    available: room.status === 'empty'
  })) || [];

  // Filter rooms based on selected category
  const filteredRooms = selectedCategory === "all" 
    ? rooms 
    : rooms.filter(room => room.type?.toUpperCase() === selectedCategory);

  // Get current rooms for pagination
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  // Calculate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredRooms.length / roomsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleBookNow = (room) => {
    setSelectedRoom(room);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    try {
      const bookingData = {
        roomId: selectedRoom._id,
        checkIn: paymentDetails.checkIn,
        checkOut: paymentDetails.checkOut,
        totalAmount: paymentDetails.amount,
        guestName: paymentDetails.guestName,
        phoneNumber: paymentDetails.phoneNumber,
        numberOfDays: paymentDetails.numberOfDays,
        paymentMethod: paymentDetails.paymentMethod
      };

      await dispatch(createBooking(bookingData)).unwrap();
      Notify.success("Room booked successfully!");
      setShowPayment(false);
      navigate('/booking-history');
    } catch (error) {
      Notify.error(error.response?.data?.message || "Failed to book room");
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">Available Rooms</h2>

      {/* Category Navigation */}
      <Nav 
        variant="pills" 
        className="mb-4"
        activeKey={selectedCategory}
        onSelect={(category) => {
          setSelectedCategory(category);
          setCurrentPage(1);
        }}
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

      {/* Room Display */}
      {loading ? (
        <Row>
          {[...Array(6)].map((_, index) => (
            <Col key={index} xs={12} md={6} lg={4} className="mb-4">
              <CardPlaceholder />
            </Col>
          ))}
        </Row>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : currentRooms.length === 0 ? (
        <Alert variant="info">
          No rooms available for the selected category.
        </Alert>
      ) : (
        <>
          <Row>
            {currentRooms.map((room) => (
              <Col key={room._id} xs={12} className="mb-4">
                <Cards
                  data={room}
                  onBookNow={() => handleBookNow(room)}
                />
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

      {/* Payment Modal */}
      {showPayment && selectedRoom && (
        <Payment
          show={showPayment}
          handleClose={() => setShowPayment(false)}
          amount={selectedRoom.price}
          onPaymentSuccess={handlePaymentSuccess}
          selectedRoom={selectedRoom}
        />
      )}
    </Container>
  );
};

export default Booking;