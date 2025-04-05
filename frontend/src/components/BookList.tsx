import React from 'react';
import { Offcanvas, ListGroup, Row, Col, Card, Button } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { Book } from '../types/Book';
import Pagination from './Pagination';

interface BookListProps {
  books: Book[];
  totalBooks: number;
  currentPage: number;
  booksPerPage: number;
  onPageChange: (pageNumber: number) => void;
  onUpdateBook: (book: Book) => void;
  onDeleteBook: (id: number) => void;
  showCart: boolean;
  toggleCart: () => void;
}

const BookList: React.FC<BookListProps> = ({
  books,
  totalBooks,
  currentPage,
  booksPerPage,
  onPageChange,
  onUpdateBook,
  onDeleteBook,
  showCart,
  toggleCart,
}) => {
  const { cart, addToCart } = useCart();

  return (
    <div className="mt-4 text-center">
      {/* Cards */}
      <Row className="justify-content-center">
        {books.length > 0 ? (
          books.map((book) => (
            <Col
              key={book.bookId}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="d-flex justify-content-center mb-4"
            >
              <div style={{ width: '2000px' }}>
                <Card className="text-center shadow-sm h-100">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                      <Card.Title>{book.title}</Card.Title>
                      <Card.Text>
                        <strong>Author:</strong> {book.author}<br />
                        <strong>Category:</strong> {book.category}<br />
                        <strong>Price:</strong> ${book.price.toFixed(2)}
                      </Card.Text>
                    </div>
                    <div className="mt-3 d-grid gap-2">
                      <Button variant="primary" size="sm" onClick={() => addToCart(book)}>
                        Add to Cart
                      </Button>
                      <Button variant="warning" size="sm" onClick={() => onUpdateBook(book)}>
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => onDeleteBook(book.bookId)}>
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          ))
        ) : (
          <p className="text-center">No books found.</p>
        )}
      </Row>

      {/* Pagination */}
      <Pagination
        booksPerPage={booksPerPage}
        totalBooks={totalBooks}
        paginate={onPageChange}
        currentPage={currentPage}
      />

      {/* Cart Toggle */}
      <div className="text-center">
        <Button className="btn btn-secondary mt-3" onClick={toggleCart}>
          {showCart ? 'Hide Cart' : 'View Cart'}
        </Button>
      </div>

      {/* Cart Offcanvas */}
      <Offcanvas show={showCart} onHide={toggleCart} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Your Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ListGroup>
              {cart.map((item) => (
                <ListGroup.Item key={item.bookId}>
                  {item.title} (x{item.quantity}) - ${item.price.toFixed(2)}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Offcanvas.Body>
      </Offcanvas>

    </div>
  );
};

export default BookList;
