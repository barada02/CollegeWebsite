import React, { useState, useEffect } from 'react';
import './ImageGallery.css';

interface ImageGalleryProps {
  images: string[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
  height?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  autoSlide = true,
  autoSlideInterval = 4000,
  height = "500px"
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide functionality
  useEffect(() => {
    if (!autoSlide || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [autoSlide, autoSlideInterval, images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  if (!images || images.length === 0) {
    return <div className="gallery-placeholder">No images available</div>;
  }

  return (
    <div className="image-gallery" style={{ height }}>
      <div className="gallery-container">
        {/* Image Display */}
        <div className="gallery-slides">
          {images.map((image, index) => (
            <div
              key={index}
              className={`gallery-slide ${index === currentIndex ? 'active' : ''}`}
            >
              <img 
                src={image} 
                alt={`Aurora University - Slide ${index + 1}`}
                className="gallery-image"
              />
              <div className="slide-overlay">
                <div className="slide-content">
                  <h2 className="slide-title">Aurora University</h2>
                  <p className="slide-subtitle">Building Tomorrow's Leaders</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button 
              className="gallery-nav gallery-nav-prev" 
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              &#8249;
            </button>
            <button 
              className="gallery-nav gallery-nav-next" 
              onClick={goToNext}
              aria-label="Next image"
            >
              &#8250;
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className="gallery-dots">
            {images.map((_, index) => (
              <button
                key={index}
                className={`gallery-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
