import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProductSubscriptionCard() {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [flavor1, setFlavor1] = useState(null);
  const [flavor2, setFlavor2] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = import.meta.env.VITE_SUBSCRIPTION_URL;
        const res = await axios.get(url);
        setProductData(res.data);
        setSelectedPlan(res.data.plans[0]?.id || null);
        setFlavor1(res.data.flavors[0]?.id || null);
        setFlavor2(res.data.flavors[1]?.id || null);
      } catch (err) {
        console.error(err);
        setError('Failed to load product data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading product data...</p>;
  if (error) return <p>{error}</p>;
  if (!productData) return null;

  const { title, rating, reviews, description, plans, flavors } = productData;

  const getFlavorImage = (id) => flavors.find((f) => f.id === id)?.image || '';

  const onPlanChange = (planId) => {
    setSelectedPlan(planId);
    if (planId === 'single') setFlavor2(null);
    else if (!flavor2) setFlavor2(flavors[1]?.id || null);
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.heading}>{title}</h2>
      <p style={styles.rating}>★ {rating.toFixed(1)} ({reviews.toLocaleString()} reviews)</p>
      <p style={styles.description}>{description}</p>

      <div style={styles.purchaseContainer}>
        <div style={styles.recommendedLabel}>Recommended</div>
        <div style={styles.purchaseBox}>
          <div style={styles.planSection}>
            {plans.map((plan) => (
              <label key={plan.id} style={styles.radioLabel}>
                <input
                  type="radio"
                  name="plan"
                  value={plan.id}
                  checked={selectedPlan === plan.id}
                  onChange={() => onPlanChange(plan.id)}
                />
                <div style={styles.planInfo}>
                  <strong>{plan.label}</strong> – ${plan.price.toFixed(2)}{' '}
                  <s style={{ color: '#999' }}>${plan.originalPrice}</s>
                </div>
              </label>
            ))}
          </div>

          <div>
            <h4>Choose Flavor 1</h4>
            {renderFlavorOptions(flavor1, setFlavor1, flavors)}
          </div>

          {selectedPlan === 'double' && (
            <div>
              <h4 style={{ marginTop: '10px' }}>Choose Flavor 2</h4>
              {renderFlavorOptions(flavor2, setFlavor2, flavors)}
            </div>
          )}

          <div style={styles.includedSection}>
            <h4>What's Included:</h4>
            <div style={styles.includedBoxes}>
              <div style={styles.includedBox}>
                <p style={styles.includedTitle}>Every 30 Days</p>
                {flavor1 && (
                  <img
                    src={getFlavorImage(flavor1)}
                    alt={`Flavor 1 ${flavor1}`}
                    style={styles.includedImage}
                  />
                )}
                {selectedPlan === 'double' && flavor2 && (
                  <img
                    src={getFlavorImage(flavor2)}
                    alt={`Flavor 2 ${flavor2}`}
                    style={styles.includedImage}
                  />
                )}
              </div>

              <div style={styles.includedBox}>
                <p style={styles.includedTitle}>
                  One Time <span style={{ color: 'green' }}>(Free)</span>
                </p>
                {flavors.map((flavor) => (
                  <img
                    key={flavor.id}
                    src={flavor.image}
                    alt={flavor.label}
                    style={styles.includedImage}
                  />
                ))}
              </div>
            </div>

            <ul style={styles.featureList}>
              <li>Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.</li>
              <li style={styles.boldFeature}>
                Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.
              </li>
              <li>Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.</li>
              <li>Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.</li>
              <li>Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.</li>
            </ul>
          </div>
        </div>
      </div>

      <button style={styles.button} onClick={() => setShowPopup(true)}>
        Add to Cart
      </button>

      {showPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <h3>Added to Cart</h3>
            <p><strong>Plan:</strong> {plans.find(p => p.id === selectedPlan)?.label}</p>
            <p><strong>Flavor 1:</strong> {flavors.find(f => f.id === flavor1)?.label}</p>
            {selectedPlan === 'double' && (
              <p><strong>Flavor 2:</strong> {flavors.find(f => f.id === flavor2)?.label}</p>
            )}
            <button onClick={() => setShowPopup(false)} style={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const renderFlavorOptions = (selected, setSelected, flavors) => (
  <div style={styles.flavorGrid}>
    {flavors.map((flavor, index) => (
      <label
        key={flavor.id}
        style={{
          ...styles.flavorOption,
          ...(selected === flavor.id ? styles.activeFlavor : {}),
        }}
      >
        <input
          type="radio"
          name={`flavor-${setSelected.name}`}
          value={flavor.id}
          checked={selected === flavor.id}
          onChange={() => setSelected(flavor.id)}
          style={{ display: 'none' }}
        />
        <img src={flavor.image} alt={flavor.label} style={styles.flavorImage} />
        <div>{flavor.label}</div>
        {index === 0 && (
          <div style={styles.bestSellerTag}>Best Seller</div>
        )}
      </label>
    ))}
  </div>
);

const styles = {
  card: {
    border: '1px solid #ccc',
    padding: 20,
    maxWidth: 480,
    margin: '0 auto',
    borderRadius: 8,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 22,
    marginBottom: 4,
  },
  rating: {
    marginBottom: 15,
    color: '#666',
    fontSize: 14,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 25,
  },
  purchaseContainer: {
    marginBottom: 20,
  },
  recommendedLabel: {
    backgroundColor: '#b99168',
    color: 'white',
    padding: '6px 12px',
    fontSize: 14,
    fontWeight: 600,
    textAlign: 'center',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  purchaseBox: {
    border: '1px solid #ddd',
    padding: 20,
  },
  planSection: {
    marginBottom: 20,
  },
  radioLabel: {
    display: 'block',
    marginBottom: 12,
    cursor: 'pointer',
  },
  planInfo: {
    display: 'inline-block',
    marginLeft: 8,
  },
  flavorGrid: {
    display: 'flex',
    gap: 15,
    marginTop: 10,
  },
  flavorOption: {
    textAlign: 'center',
    cursor: 'pointer',
    padding: 10,
    borderRadius: 6,
  },
  activeFlavor: {
    border: '2px solid #000',
    backgroundColor: '#f3f3f3',
  },
  flavorImage: {
    width: 50,
    height: 100,
    objectFit: 'contain',
  },
  bestSellerTag: {
    marginTop: 6,
    backgroundColor: '#b99168',
    color: '#fff',
    fontSize: 12,
    padding: '2px 6px',
    borderRadius: 4,
    display: 'inline-block',
  },
  includedSection: {
    marginTop: 25,
  },
  includedBoxes: {
    display: 'flex',
    gap: 20,
    marginTop: 10,
  },
  includedBox: {
    flex: 1,
    border: '1px solid #ddd',
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
  includedTitle: {
    marginBottom: 6,
    fontWeight: 500,
  },
  includedImage: {
    width: 40,
    height: 80,
    margin: '5px 4px',
    objectFit: 'contain',
  },
  featureList: {
    marginTop: 20,
    paddingLeft: 20,
    color: '#444',
    fontSize: 14,
  },
  boldFeature: {
    fontWeight: 600,
    color: '#000',
  },
  button: {
    marginTop: 25,
    width: '100%',
    padding: 12,
    backgroundColor: 'black',
    color: 'white',
    fontSize: 16,
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    borderRadius: '20px',
  },
  popupOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 8,
    maxWidth: 300,
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
  },
  closeButton: {
    marginTop: 20,
    padding: '10px 20px',
    backgroundColor: '#b99168',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  },
};
