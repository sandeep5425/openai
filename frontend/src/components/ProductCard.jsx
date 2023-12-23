import React, { useState ,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  
  // Initialize cart state from localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    // console.log(savedCart);
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  //define naviagte
  const navigate = useNavigate();
  
  const handleIncreaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  // Update localStorage whenever cart changes
  useEffect(() => {
    //remove if cart present
    localStorage.removeItem('cart');
    localStorage.setItem('cart', JSON.stringify(cart));
    // console.log(cart);
  }, [cart]);


  const handleAddToCart = () => {
    // Check if the product already exists in the cart
    const existingItem = cart.find(item => item.id === product.id);
  
    if (existingItem) {
      // If the product exists, update its quantity
      setCart(prevCart => 
        prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      // If the product doesn't exist, add it to the cart with a quantity of 1
      setCart(prevCart => [...prevCart, { ...product, quantity: 1 }]);
    }
  };
  

  


  const handleBuyNow = () => {    
    // Redirect to the payment page using the navigate function
    // setCart(prevCart => [...prevCart, { ...product, quantity: 1 }]);
    const newProduct = {
      ...product,
      quantity
    }
    // console.log("Hanlde buy");
    setCart(prevCart => [ newProduct]);
    // navigate(`/payment`);
    setTimeout(() => {
        navigate(`/payment`);
      }, 500);
  };
  

  //define imageStyling
  const imageStyling = {
    width: '100%',       
    height: '100%',       
    maxHeight: '300px',  
  }

  return (
    <div className="card">
        <Link to={`/product/${product.id}`} >
        <img src={product.image} style={imageStyling}  className="card-img-top" alt={product.title} />
        </Link>
      <div className="card-body">
      <Link to={`/product/${product.id}`} >
        <h5 className="card-title">{product.title}</h5>
      </Link>
        <p className="card-text">Price: {product.price}</p>
        <p className="card-text">Description: {product.category}</p>
        <p className="card-text">Rating: {product.rating.rate}</p>
        <div className="d-flex justify-content-between align-items-center">
          <div className="btn-group">
            <button className="btn btn-outline-secondary" onClick={handleDecreaseQuantity}>-</button>
            <button className="btn btn-outline-secondary">{quantity}</button>
            <button className="btn btn-outline-secondary" onClick={handleIncreaseQuantity}>+</button>
          </div>

          <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
          <button className="btn btn-success" onClick={handleBuyNow}>Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
