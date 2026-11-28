import { useState, useEffect } from 'react';
import { ProductList } from './components/ProductList.jsx';
import { fetchProducts } from './api/products.js';
import clearIcon from './assets/clearIcon.svg';
import './App.css';


function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
    
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

  function handleClearSearch(){
    setSearchQuery('')
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


  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const filteredProducts = normalizedSearchQuery === ''
  ? products 
  : products.filter((product) => product.title.toLowerCase().includes(normalizedSearchQuery));

  let sortedProducts = [...filteredProducts];
  sortedProducts = sortOption === 'name-asc'
  ? sortedProducts.sort(function(a, b){
      return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    })
  : sortOption === 'price-asc'
  ? sortedProducts.sort((a, b) => a.price - b.price)
  : sortOption === 'price-desc'
  ? sortedProducts.sort((a, b) => b.price - a.price)
  : sortedProducts;

  return (
    <div className='appContainer'>
      <header className='appHeader'>
        <h1 className='appTitle'>Product Explorer</h1>
        <p className='appDescription'>Browse products and search by name.</p>
      </header>

      <div className='searchBoxContainer'>
        <label 
          htmlFor='search-input' 
          className='searchLabel'>
          Search products
          <div className='searchInputContainer'>
            <input id='search-input' 
            type='search'
            className='searchInput' 
            placeholder='Enter product Name' 
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value)
            }}/>
            {searchQuery && (
              <button type='button' className='clearSearchBtn' onClick={handleClearSearch}>
                <img src={clearIcon}/>
              </button>
            )}
          </div>
        </label>

        <select 
        value={sortOption}
        onChange = {((event) => {
          setSortOption(event.target.value)
        })}
        aria-label='Sort products'
        className='selectSortContainer'
        >
          <option value=''>Default order</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="price-asc">Price: Low to high</option>
          <option value="price-desc">Price: High to low</option>
        </select>
      </div>

      <div className='resultsCountContainer'>
        <p className='resultsCount'>
          Showing {sortedProducts.length} products
        </p>
      </div>

      <>
        {filteredProducts.length === 0
          ? <div className='noProductsMsgContainer'>
              <h2 className='noProductsMsg'>
                NO PRODUCTS FOUND
              </h2>
              <p className='noProductsMsgDescription'>
                Try a different product name or change the sorting option
              </p>
            </div>
          : 
          <div className='productListContainer'>
            <ProductList products={sortedProducts} />
          </div>
        }
      </>
      
    </div>
  )
}

export default App;
