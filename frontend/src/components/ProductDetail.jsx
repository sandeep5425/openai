import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = ({products}) => {
  // Get the product ID from the URL
  const { id } = useParams();

  if (!products || products.length === 0) {
    return <div className="alert">Loading...</div>;
  }

  // Find the product with the given ID
  const product = products.find(p => p.id === parseInt(id));
  
  if (!product) {
    return <div className="alert alert-danger">Product not found</div>;
  }

  const handleAddToCart = () => {
    // Implement logic to add product to cart
    // console.log('Added to cart:', product.title);
  };

  const handleBuyNow = () => {
    // Implement logic to buy product
    // console.log('Buying now:', product.title);
  };
  
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img src={product.image} alt={product.title} className="img-fluid rounded" />
        </div>
        <div className="col-md-6">
          <h2>{product.title}</h2>
          <p className="lead">Price: ${product.price}</p>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Rating:</strong> {product.rating.rate} ({product.rating.count} reviews)</p>
          <div className="mt-4">
            <button className="btn btn-success me-2" onClick={handleBuyNow} >Buy Now</button>
            <button className="btn btn-primary"  onClick={handleAddToCart} >Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
