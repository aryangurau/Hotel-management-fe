import { Button, Card, Col, Row, Carousel, Modal } from "react-bootstrap";
import { useState } from "react";
import { FaBed, FaWifi, FaParking, FaSwimmingPool, FaCoffee, FaTv, FaSnowflake, FaMapMarkerAlt } from 'react-icons/fa';
import BookingModal from "./BookingModal";
import './css/card.css';

const hotelSets = [
  {
    main: {
      url: "https://images.unsplash.com/photo-1455587734955-081b22074882",
      caption: "Modern Hotel"
    },
    dining: {
      url: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d",
      caption: "Fine Dining"
    },
    room: {
      url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
      caption: "Luxury Suite"
    }
  },
  {
    main: {
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
      caption: "Beach Resort"
    },
    view: {
      url: "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6",
      caption: "Private Beach"
    },
    pool: {
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
      caption: "Infinity Pool"
    }
  },
  {
    main: {
      url: "https://images.unsplash.com/photo-1517320964276-a002fa203177",
      caption: "Mountain Lodge"
    },
    view: {
      url: "https://images.unsplash.com/photo-1502786129293-79981df4e689",
      caption: "Mountain View"
    },
    dining: {
      url: "https://images.unsplash.com/photo-1586999768265-24af89630739",
      caption: "Alpine Restaurant"
    }
  }
];

export const Cards = ({ data, onBookNow }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCloseBooking = () => setShowBookingModal(false);
  const handleShowBooking = () => setShowBookingModal(true);

  const handleCloseImage = () => setShowImageModal(false);
  const handleShowImage = () => setShowImageModal(true);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    handleShowImage();
  };

  const handleProceedToPayment = () => {
    handleCloseBooking();
    onBookNow(data);
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <FaWifi />;
      case 'parking': return <FaParking />;
      case 'pool': case 'swimming pool': return <FaSwimmingPool />;
      case 'restaurant': case 'cafe': return <FaCoffee />;
      case 'tv': return <FaTv />;
      case 'ac': return <FaSnowflake />;
      default: return <FaBed />;
    }
  };

  return (
    <Card className="hotel-card">
      <Row className="g-0">
        <Col md={5} lg={4} className="h-100">
          <Carousel interval={null} className="h-100">
            <Carousel.Item className="h-100">
              <div className="image-wrapper">
                <img
                  className="hotel-image"
                  src={data.image}
                  alt={data.name}
                  onClick={() => handleImageClick(data.image)}
                />
                <div className="image-overlay">
                  <span className="image-caption">{data.name}</span>
                </div>
              </div>
            </Carousel.Item>
          </Carousel>
        </Col>
        <Col md={7} lg={8}>
          <Card.Body className="p-3">
            <Row className="h-100">
              <Col lg={8}>
                <Card.Title className="hotel-name mb-2">{data.name}</Card.Title>
                <div className="location mb-2">
                  <FaMapMarkerAlt /> {data.location}
                </div>
                <Card.Text className="description mb-3">{data.description}</Card.Text>
                <div className="amenities">
                  {(data.amenities || []).map((amenity, index) => (
                    <span key={index} className="amenity-badge">
                      {getAmenityIcon(amenity)} {amenity}
                    </span>
                  ))}
                </div>
              </Col>
              <Col lg={4} className="d-flex flex-column justify-content-between">
                <div className="rating-box text-center mb-3">
                  <div className="rating-score">{data.rating} / 5</div>
                  <div className="rating-text">Excellent</div>
                </div>
                <div className="price-box text-center">
                  <div className="price">NPR {data.price.toLocaleString()}</div>
                  <div className="price-text mb-2">per night</div>
                  <Button 
                    variant="primary" 
                    className="book-now-btn"
                    onClick={handleShowBooking}
                  >
                    Book Now
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Col>
      </Row>

      {/* Booking Modal */}
      <BookingModal
        show={showBookingModal}
        handleClose={handleCloseBooking}
        room={data}
        onProceedToPayment={handleProceedToPayment}
      />

      {/* Image Modal */}
      <Modal
        show={showImageModal}
        onHide={handleCloseImage}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{data.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={selectedImage}
            alt={data.name}
            style={{ width: '100%', height: 'auto' }}
          />
        </Modal.Body>
      </Modal>
    </Card>
  );
};