import React from 'react';
import { useCart } from './CartContext'; // Import the useCart hook to access cart context
import { Container, Row, Col, ListGroup, Button } from 'react-bootstrap';

// Define the Cart component
const Cart: React.FC = () => {
  // Destructure cart and removeFromCart function from the CartContext
  const { cart, removeFromCart } = useCart();

  // Calculate the total price of all items in the cart
  const getTotal = () =>
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  return (
    <Container className="mt-4">
      <Row>
        <Col xs={12}>
          {/* Display the shopping cart title */}
          <h2 className="text-center">Shopping Cart</h2>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          {/* Check if the cart is empty */}
          {cart.length === 0 ? (
            // Show a message if the cart is empty
            <p className="text-center">Your cart is empty.</p>
          ) : (
            <>
              {/* List the items in the cart */}
              <ListGroup>
                {cart.map((item) => (
                  <ListGroup.Item
                    key={item.bookId} // Use bookId as a unique key
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      {/* Display item title, quantity, and price */}
                      {item.title} (x{item.quantity}) - ${item.price.toFixed(2)} each
                    </div>
                    {/* Button to remove item from cart */}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromCart(item.bookId)} // Call removeFromCart with the bookId
                    >
                      Remove
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              {/* Display the total price */}
              <h4 className="mt-3 text-end">Total: ${getTotal()}</h4>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
