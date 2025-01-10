import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './css/Banner.css';

const Banner = ({ onSearch }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    type: '',
    priceRange: '',
    guests: '',
    checkIn: '',
    checkOut: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchParams);
    }
  };

  return (
    <div className="hero-banner">
      <Carousel 
        fade={false}
        interval={5000} 
        controls={false} 
        indicators={true}
      >
        <Carousel.Item>
          <div 
            className="carousel-image" 
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
            }}
          >
            <div className="overlay"></div>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div 
            className="carousel-image" 
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
            }}
          >
            <div className="overlay"></div>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div 
            className="carousel-image" 
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2225&q=80')`
            }}
          >
            <div className="overlay"></div>
          </div>
        </Carousel.Item>
      </Carousel>

      <div className="hero-content">
        <div className="row">
          <div className="col-12 text-center mb-4">
            <h1>Find Your Perfect Stay</h1>
            <h2>Discover amazing deals on hotels and resorts</h2>
          </div>
        </div>

        <div className="search-container">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-group">
              <label>
                <i className="bi bi-building"></i>
                Room Type
              </label>
              <select 
                className="search-input"
                value={searchParams.type}
                onChange={(e) => setSearchParams(prev => ({...prev, type: e.target.value}))}
              >
                <option value="">All Types</option>
                <option value="single">Single Room</option>
                <option value="double">Double Room</option>
                <option value="suite">Suite</option>
              </select>
            </div>

            <div className="search-group">
              <label>
                <i className="bi bi-currency-dollar"></i>
                Price
              </label>
              <select 
                className="search-input"
                value={searchParams.priceRange}
                onChange={(e) => setSearchParams(prev => ({...prev, priceRange: e.target.value}))}
              >
                <option value="">Any Price</option>
                <option value="0-1000">Under Rs. 1000</option>
                <option value="1000-2000">Rs. 1000 - 2000</option>
                <option value="2000-5000">Rs. 2000 - 5000</option>
                <option value="5000+">Above Rs. 5000</option>
              </select>
            </div>

            <div className="search-group">
              <label>
                <i className="bi bi-people"></i>
                Guests
              </label>
              <select 
                className="search-input"
                value={searchParams.guests}
                onChange={(e) => setSearchParams(prev => ({...prev, guests: e.target.value}))}
              >
                <option value="">Select</option>
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5+">5+ Guests</option>
              </select>
            </div>

            <button type="submit" className="search-button">
              <i className="bi bi-search me-2"></i>
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Banner;
