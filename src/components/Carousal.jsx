import { useState, useEffect } from 'react';
import axios from 'axios';

const styles = {
  container: {
    textAlign: 'center',
  },
  mainImageWrapper: {
    position: 'relative',
    width: '300px',
    height: '400px',
    margin: '0 auto',
    backgroundColor: '#fafafa',
    borderRadius: '10px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainImage: {
    maxHeight: '100%',
    maxWidth: '100%',
    objectFit: 'contain',
    transition: 'opacity 0.3s ease-in-out',
  },
  navButton: {
    fontSize: '24px',
    backgroundColor: 'white',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '190px',
    zIndex: 2,
  },
  dots: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
    gap: '5px',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#ccc',
    cursor: 'pointer',
  },
  activeDot: {
    backgroundColor: '#333',
  },
  thumbnailGrid: {
    marginTop: '15px',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: 'repeat(2, auto)',
    gap: '10px',
    maxWidth: '400px',
    margin: '15px auto',
  },
  thumbnail: {
    width: '100%',
    height: '60px',
    objectFit: 'contain',
    border: '2px solid transparent',
    cursor: 'pointer',
    borderRadius: '6px',
  },
  activeThumbnail: {
    border: '2px solid #333',
  },
};

export default function ProductGallery() {
  const [productImages, setProductImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const url=import.meta.env.VITE_CAROUSAL_URL;
        const response = await axios.get(url);//'http://localhost:5000/api/products/images'
        setProductImages(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load product images.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const selectImage = (index) => {
    setCurrentIndex(index);
  };

  if (loading) return <p>Loading images...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      <div style={styles.mainImageWrapper}>
        <img
          src={productImages[currentIndex]?.url}
          alt={`Product ${currentIndex + 1}`}
          style={styles.mainImage}
        />

        <div style={styles.bottomButtonContainer}>
          <button onClick={goToPrevious} style={styles.navButton}>
            &#8592;
          </button>
          <button onClick={goToNext} style={styles.navButton}>
            &#8594;
          </button>
        </div>
      </div>

      <div style={styles.dots}>
        {productImages.map((_, idx) => (
          <div
            key={idx}
            style={{
              ...styles.dot,
              ...(currentIndex === idx ? styles.activeDot : {}),
            }}
            onClick={() => selectImage(idx)}
          />
        ))}
      </div>

      <div style={styles.thumbnailGrid}>
        {productImages.slice(0, 8).map((image, idx) => (
          <img
            key={idx}
            src={image.url}
            alt={`Thumbnail ${idx + 1}`}
            style={{
              ...styles.thumbnail,
              ...(idx === currentIndex ? styles.activeThumbnail : {}),
            }}
            onClick={() => selectImage(idx)}
          />
        ))}
      </div>
    </div>
  );
}
