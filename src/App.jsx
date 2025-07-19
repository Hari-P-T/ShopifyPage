import ProductGallery from './components/Carousal';
import ProductSubscriptionCard from './components/ShoppingCard';

const mainStyles = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '20px',
};

const leftSectionStyles = {
  width: '50%',
  padding: '20px',
  borderRight: '1px solid #ccc',
};

const rightSectionStyles = {
  width: '50%',
  padding: '20px',
};

const productImages = []

const App = () => {
  return(
    <div>
    <main style={mainStyles}>
      <section style={leftSectionStyles}>
        <ProductGallery/>
      </section>
      <section style={rightSectionStyles}>
        <ProductSubscriptionCard />
      </section>
    </main>
  </div>
  )
};

export default App;