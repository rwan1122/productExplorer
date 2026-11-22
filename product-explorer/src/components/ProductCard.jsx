export function ProductCard({product}){
  return(
    <div>
      <p>{product.title}</p>
      <p>{product.price}</p>
      <p>{product.category}</p>
    </div>
  )
};