import './ProductCard.css';

export function ProductCard({product}){
  return(
    <article className='productCardContainer'>
      <img 
      src={product.thumbnail} 
      alt={product.title} 
      className="productImg" 
      loading='lazy' 
      decoding='async'
      width='250px'
      height='250px'
      />
      <h3 className="productTitle">{product.title}</h3>
      <p className="productPrice">$ {product.price}</p>
      <p className="productCategory">{product.category}</p>
    </article>
  )
};