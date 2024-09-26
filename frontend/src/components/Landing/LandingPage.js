import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Header />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero__content">
          <br/><br/><br/><br/><br/><br/><br/><br/><br/>
          <button className="hero__button">Start Watching</button>
        </div>
      </section>

      {/* Featured Content */}
      <section className="featured">
        <h2>Featured Shows & Movies</h2>
        <div className="featured__carousel">
          <div className="carousel__item"><img src="/images/mid1.jpg" alt="Feature 1" /></div>
          <div className="carousel__item"><img src="/images/mid2.jpg" alt="Feature 2" /></div>
          <div className="carousel__item"><img src="/images/mid3.jpg" alt="Feature 1" /></div>
          <div className="carousel__item"><img src="/images/mid4.jpg" alt="Feature 2" /></div>
          <div className="carousel__item"><img src="/images/mid5.jpg" alt="Feature 2" /></div>
          <div className="carousel__item"><img src="/images/mid6.jpg" alt="Feature 2" /></div>
        </div>
      </section>

      {/* Popular Shows Section */}
      <section className="popular">
        <h2>Popular Shows</h2>
        <div className="popular__grid">
          <div className="grid__item"><img src="/images/lower-1.jpeg" alt="Popular 1" /></div>
          <div className="grid__item"><img src="/images/lower-2.jpg" alt="Popular 2" /></div>
          <div className="grid__item"><img src="/images/lower-3.jpg" alt="Popular 3" /></div>
          <div className="grid__item"><img src="/images/lower-4.jpg" alt="Popular 4" /></div>
          <div className="grid__item"><img src="/images/lower-5.jpg" alt="Popular 5" /></div>
          {/* Add more items as needed */}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
