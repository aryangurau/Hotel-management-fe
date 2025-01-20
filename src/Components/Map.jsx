import React from 'react';
import { Card } from 'react-bootstrap';
import { FaMapMarkerAlt, FaDirections } from 'react-icons/fa';

const Map = () => {
  // Hotel location coordinates (example: Kathmandu)
  const hotelLocation = {
    lat: 27.7172,
    lng: 85.3240
  };

  const handleMapClick = () => {
    window.open('https://goo.gl/maps/YOUR_HOTEL_LOCATION');
  };

  return (
    <div className="map-wrapper">
      <div className="map-background"></div>
      <Card className="map-container">
        <Card.Body className="p-0">
          <div className="map-content">
            <div className="map-info p-3">
              <h5 className="mb-2 d-flex align-items-center">
                <FaMapMarkerAlt className="text-danger me-2" />
                XYZ Hotel
              </h5>
              <p className="text-muted mb-2 small">123 Hotel Street, Kathmandu, Nepal</p>
              <button 
                className="btn btn-sm btn-outline-primary d-flex align-items-center"
                onClick={handleMapClick}
              >
                <FaDirections className="me-1" /> Get Directions
              </button>
            </div>
            <div 
              className="map-frame" 
              onClick={handleMapClick}
            >
              <div className="static-map">
                <div className="map-pin">
                  <FaMapMarkerAlt className="text-danger" size={24} />
                  <div className="pin-shadow"></div>
                </div>
              </div>
              <div className="map-overlay">
                <div className="map-overlay-content">
                  <FaMapMarkerAlt className="text-danger" size={20} />
                  <span className="ms-2">View Location</span>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Map;
