import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/shared/Button';
import ImageGallery from '../../components/college/ImageGallery';
import './Home.css';

export const Home: React.FC = () => {
  // College images for the gallery
  const collegeImages = [
    '/src/assets/college/college_Building.jpg',
    '/src/assets/college/college_b1.jpg',
    '/src/assets/college/magazine.jpg',
    '/src/assets/college/vc.jpg'
  ];

  return (
    <div className="home-page">
      {/* Hero Section with Image Gallery */}
      <section className="hero-section">
        <div className="hero-gallery-container">
          <ImageGallery 
            images={collegeImages}
            autoSlide={true}
            autoSlideInterval={5000}
            height="600px"
          />
        </div>
      </section>

      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="container">
          <div className="welcome-content">
            <h1 className="welcome-title">
              Welcome to <span className="highlight">Aurora University</span>
            </h1>
            <p className="welcome-description">
              Discover your potential, shape your future, and join a community 
              of innovators, leaders, and changemakers. Aurora University 
              offers world-class education in a vibrant, inclusive environment.
            </p>
            <div className="welcome-actions">
              <Link to="/admissions">
                <Button variant="college" size="lg">Apply Now</Button>
              </Link>
              <Link to="/about">
                <Button variant="college" size="lg">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">15,000+</div>
              <div className="stat-label">Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Faculty</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Programs</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Excellence University?</h2>
            <p className="section-description">
              Discover what makes us a leading institution in higher education
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3 className="feature-title">Academic Excellence</h3>
              <p className="feature-description">
                Top-ranked programs with world-class faculty and cutting-edge research opportunities.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3 className="feature-title">Global Community</h3>
              <p className="feature-description">
                Diverse student body from over 50 countries creating a rich, multicultural environment.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3 className="feature-title">Career Success</h3>
              <p className="feature-description">
                95% job placement rate with strong industry connections and career support services.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔬</div>
              <h3 className="feature-title">Innovation Hub</h3>
              <p className="feature-description">
                State-of-the-art facilities and labs fostering creativity, research, and innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* News & Events Section */}
      <section className="news-events-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Latest News & Events</h2>
            <Link to="/events">
              <Button variant="college">View All Events</Button>
            </Link>
          </div>
          <div className="news-events-grid">
            <div className="news-card">
              <div className="news-image-placeholder">📅</div>
              <div className="news-content">
                <h3 className="news-title">Annual Tech Conference 2024</h3>
                <p className="news-date">March 15, 2024</p>
                <p className="news-excerpt">
                  Join us for the biggest technology conference featuring industry leaders 
                  and innovative research presentations.
                </p>
              </div>
            </div>
            <div className="news-card">
              <div className="news-image-placeholder">🎨</div>
              <div className="news-content">
                <h3 className="news-title">Art Exhibition Opening</h3>
                <p className="news-date">March 20, 2024</p>
                <p className="news-excerpt">
                  Discover the creative works of our talented students in this 
                  semester's art exhibition showcase.
                </p>
              </div>
            </div>
            <div className="news-card">
              <div className="news-image-placeholder">🏃</div>
              <div className="news-content">
                <h3 className="news-title">Spring Sports Championship</h3>
                <p className="news-date">April 5, 2024</p>
                <p className="news-excerpt">
                  Cheer on our athletic teams as they compete in the regional 
                  championship games this spring.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Your Journey?</h2>
            <p className="cta-description">
              Take the first step towards an exceptional education and bright future.
            </p>
            <div className="cta-actions">
              <Link to="/admissions">
                <Button variant="college" size="lg">Apply Today</Button>
              </Link>
              <Link to="/contact">
                <Button variant="college" size="lg">Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
