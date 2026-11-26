import { useState, useEffect } from 'react';
import { ProductList } from './components/ProductList.jsx';
import { fetchProducts } from './api/products.js';
// import { products } from './data/products.js';
// import searchIcon from './assets/searchIcon.svg';
import './App.css';


function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
    
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

  function filteredProducts(){
    if(searchQuery === ''){
      return products;
    }

    const filtProducts = products.filter((product) => product.title.toLocaleLowerCase().includes(searchQuery.trim().toLocaleLowerCase()));


    return filtProducts;
  }
        

  return (
    <div className='appContainer'>
      <div className='searchBoxContainer'>
        <input type='text'
        className='searchInput' 
        placeholder='Product Name' 
        value={searchQuery}
        onChange={(event) => {
          setSearchQuery(event.target.value)
        }}
        />
        {/* <button type='button' className='searchBtn'>
          <img src={searchIcon} alt="Search" className='searchIcon'/>
        </button> */}
      </div>

      <>
        {filteredProducts().length === 0
          ? <p className='noProductsContainer'>NO PRODUCTS FOUND</p>
          : 
          <div className='productListContainer'>
            <ProductList products= {filteredProducts()} />
          </div>
        }
      </>
      
    </div>
  )
}

export default App;
