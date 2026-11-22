import { ProductCard } from './ProductCard.jsx';

export function ProductList({products}){
  return products.map((product) => {
    return(
      <ProductCard key={product.id} product={product}/>
    )
  })
}

