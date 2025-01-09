import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './css/Banner.css';

const Banner = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: '',
  });

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/', { 
      state: { 
        searchParams,
        isSearching: true 
      } 
    });
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
          <div className="col-12 text-center">
            <h1>Find Your Perfect Stay</h1>
            <h2>Discover amazing deals on hotels and resorts</h2>
          </div>
        </div>

        <div className="search-container">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-group">
              <label>
                <i className="bi bi-geo-alt-fill"></i>
                Where are you going?
              </label>
              <select 
                className="search-input"
                value={searchParams.location}
                onChange={(e) => setSearchParams(prev => ({...prev, location: e.target.value}))}
                required
              >
                <option value="">Select destination</option>
                <option value="kathmandu">Kathmandu</option>
                <option value="pokhara">Pokhara</option>
                <option value="lalitpur">Lalitpur</option>
                <option value="bharatpur">Bharatpur</option>
                <option value="biratnagar">Biratnagar</option>
              </select>
            </div>

            <div className="search-group">
              <label>
                <i className="bi bi-calendar3"></i>
                Check-in
              </label>
              <input 
                type="date" 
                className="search-input"
                value={searchParams.checkIn}
                onChange={(e) => setSearchParams(prev => ({...prev, checkIn: e.target.value}))}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="search-group">
              <label>
                <i className="bi bi-calendar3"></i>
                Check-out
              </label>
              <input 
                type="date" 
                className="search-input"
                value={searchParams.checkOut}
                onChange={(e) => setSearchParams(prev => ({...prev, checkOut: e.target.value}))}
                required
                min={searchParams.checkIn || new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="search-group">
              <label>
                <i className="bi bi-person-fill"></i>
                Guests
              </label>
              <select 
                className="search-input"
                value={searchParams.guests}
                onChange={(e) => setSearchParams(prev => ({...prev, guests: e.target.value}))}
                required
              >
                <option value="">Select</option>
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5+ Guests</option>
              </select>
            </div>

            <button type="submit" className="search-button">
              <i className="bi bi-search"></i>
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Banner;
