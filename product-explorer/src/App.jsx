import { ProductList } from './components/ProductList.jsx';
import { products } from './data/products.js';
import './App.css';

function App() {
  return (
    <>
      <ProductList products={products}/>
    </>
  )
}

export default App;
