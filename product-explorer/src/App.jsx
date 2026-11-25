import { useState, useEffect } from 'react';
import { ProductList } from './components/ProductList.jsx';
import { fetchProducts } from './api/products.js';
// import { products } from './data/products.js';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
    
  useEffect(() => {
    let ignore = false;

    const loadProducts = async() => {
      try{
        const data = await fetchProducts();
        if(!ignore){
          setProducts(data.products); 
        }
      }
      catch(error){
        if(!ignore){
          console.error(error.message);
          setErrorMessage('Unable to load products. Please try again later.');                
        }
      }
      finally{
        if(!ignore){
          setIsLoading(false)
        }
      }
    };

    loadProducts();

    return () => {
      ignore = true;
    };
  }, [retryCount]);

  function handleRetry(){
    setErrorMessage('');
    setIsLoading(true);
    setRetryCount((count) => count + 1)
  }
  
  if(isLoading){
    return (
      <p role='status'>
        loading products...
      </p>
    )
  };

  if(errorMessage){
    return (
      <div>
        <p role='alert'>
          {errorMessage}
        </p>

        <button type='button' onClick={handleRetry}>
          Try again
        </button>
      </div>
    );
  };

    return (
      <div className='productListContainer'>
        <ProductList products={products} />
      </div>
    )
}

export default App;
