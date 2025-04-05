import React from 'react';
import { useCart } from '../context/CartContext';
import { Container, Button, Table, Alert } from 'react-bootstrap';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  // Calculate total price
  const totalPrice = cart.reduce((total, book) => total + book.price * book.quantity, 0);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Shopping Cart</h2>

      {cart.length === 0 ? (
        <Alert variant="info" className="text-center">Your cart is empty.</Alert>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((book) => (
                <tr key={book.bookId}>
                  <td>{book.title}</td>
                  <td>${book.price.toFixed(2)}</td>
                  <td>
                    <Button variant="outline-secondary" size="sm" onClick={() => updateQuantity(book.bookId, book.quantity - 1)}>-</Button>
                    <span className="mx-2">{book.quantity}</span>
                    <Button variant="outline-secondary" size="sm" onClick={() => updateQuantity(book.bookId, book.quantity + 1)}>+</Button>
                  </td>
                  <td>${(book.price * book.quantity).toFixed(2)}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => removeFromCart(book.bookId)}>Remove</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h4 className="text-end">Total: ${totalPrice.toFixed(2)}</h4>

          <div className="d-flex justify-content-between mt-3">
            <Button variant="secondary" onClick={clearCart}>Clear Cart</Button>
            <Button variant="success">Checkout</Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default Cart;
