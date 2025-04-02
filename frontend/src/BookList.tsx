import React, { useState, useEffect } from 'react';
import { Table, Pagination, Form, Button, Offcanvas, ListGroup, Modal, Alert } from 'react-bootstrap';
import { FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';
import { Book } from './types/Book';
import { useCart } from './CartContext';

// Define the BookList component
const BookList: React.FC = () => {
  // State to store books
  const [books, setBooks] = useState<Book[]>([]);
  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [booksPerPage, setBooksPerPage] = useState<number>(5);
  // State for sorting
  const [sortAscending, setSortAscending] = useState<boolean>(true);
  // Cart context
  const { cart, addToCart } = useCart();
  // State for showing the cart
  const [showCart, setShowCart] = useState<boolean>(false);
  // State for modal (book details)
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  // State for cart messages
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  // Fetch books from API when component mounts
  useEffect(() => {
    fetch('https://localhost:7234/api/Bookstore')
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error('Error fetching books:', error));
  }, []);

  // Sort books based on title
  const sortedBooks = [...books].sort((a, b) => {
    return sortAscending
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title);
  });

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle changing results per page
  const handleResultsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBooksPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Toggle sort order
  const toggleSortOrder = () => setSortAscending(!sortAscending);

  // Handle adding a book to cart
  const handleAddToCart = (book: Book) => {
    addToCart(book);
    setCartMessage(`${book.title} added to cart!`);
    setTimeout(() => setCartMessage(null), 3000);
  };

  // Handle showing book details
  const handleShowDetails = (book: Book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-center">Book List</h2>

      {/* Display cart message */}
      {cartMessage && (
        <Alert variant="success" onClose={() => setCartMessage(null)} dismissible>
          {cartMessage}
        </Alert>
      )}

      {/* Button to show cart */}
      <Button
        variant="primary"
        className="mb-3"
        onClick={() => setShowCart(true)}
      >
        View Cart
      </Button>

      {/* Sort button */}
      <button className="btn btn-primary mb-3 ms-2" onClick={toggleSortOrder}>
        {sortAscending ? (
          <>
            Sort Ascending <FaSortAlphaDown />
          </>
        ) : (
          <>
            Sort Descending <FaSortAlphaUp />
          </>
        )}
      </button>

      {/* Book table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Classification</th>
            <th>Page Count</th>
            <th>Price ($)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.map((book) => (
            <tr key={book.bookId}>
              <td>
                <Button variant="link" onClick={() => handleShowDetails(book)}>
                  {book.title}
                </Button>
              </td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
              <td>{book.isbn}</td>
              <td>{book.classification}</td>
              <td>{book.pageCount}</td>
              <td>{book.price.toFixed(2)}</td>
              <td>
                <Button variant="success" onClick={() => handleAddToCart(book)}>
                  Add to Cart
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Results per page dropdown */}
      <Form.Group className="mb-3">
        <Form.Label>Results per page:</Form.Label>
        <Form.Select
          value={booksPerPage}
          onChange={handleResultsPerPageChange}
          style={{ width: '150px' }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </Form.Select>
      </Form.Group>

      {/* Pagination controls */}
      <Pagination>
        {Array.from({ length: Math.ceil(books.length / booksPerPage) }).map(
          (_, index) => (
            <Pagination.Item
              key={index + 1}
              onClick={() => paginate(index + 1)}
              active={index + 1 === currentPage}
            >
              {index + 1}
            </Pagination.Item>
          )
        )}
      </Pagination>

      {/* Offcanvas Cart Component */}
      <Offcanvas show={showCart} onHide={() => setShowCart(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Your Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <ListGroup>
              {cart.map((item, index) => (
                <ListGroup.Item key={index}>
                  {item.title} - ${item.price.toFixed(2)}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          <Button
            variant="success"
            className="mt-3"
            onClick={() => setShowCart(false)}
          >
            Proceed to Checkout
          </Button>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Modal for Book Details */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBook && (
            <div>
              <p><strong>Title:</strong> {selectedBook.title}</p>
              <p><strong>Author:</strong> {selectedBook.author}</p>
              <p><strong>Publisher:</strong> {selectedBook.publisher}</p>
              <p><strong>ISBN:</strong> {selectedBook.isbn}</p>
              <p><strong>Classification:</strong> {selectedBook.classification}</p>
              <p><strong>Page Count:</strong> {selectedBook.pageCount}</p>
              <p><strong>Price:</strong> ${selectedBook.price.toFixed(2)}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookList;
