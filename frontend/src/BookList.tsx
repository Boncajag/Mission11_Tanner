import React, { useState, useEffect } from 'react';
import { Table, Pagination, Form, Button, Offcanvas, ListGroup, Modal, Alert } from 'react-bootstrap';
import { FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';
import { Book } from './types/Book';
import { useCart } from './CartContext';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [booksPerPage, setBooksPerPage] = useState<number>(5);
  const [sortAscending, setSortAscending] = useState<boolean>(true);
  const { cart, addToCart } = useCart();
  const [showCart, setShowCart] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    fetch('https://localhost:7234/api/Bookstore')
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error('Error fetching books:', error));
  }, []);

  // Get unique categories
  const categories = ['All', ...new Set(books.map(book => book.category))];

  // Filter books based on category
  const filteredBooks = selectedCategory === 'All'
    ? books
    : books.filter(book => book.category === selectedCategory);

  // Sort books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    return sortAscending
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title);
  });

  // Handle pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleResultsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBooksPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const toggleSortOrder = () => setSortAscending(!sortAscending);

  const handleAddToCart = (book: Book) => {
    addToCart(book);
    setCartMessage(`${book.title} added to cart!`);
    setTimeout(() => setCartMessage(null), 3000);
  };

  const handleShowDetails = (book: Book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-center">Book List</h2>

      {cartMessage && (
        <Alert variant="success" onClose={() => setCartMessage(null)} dismissible>
          {cartMessage}
        </Alert>
      )}

      {/* View Cart Button */}
      <Button variant="primary" className="mb-3" onClick={() => setShowCart(true)}>
        View Cart
      </Button>

      {/* Sort Button */}
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

      {/* Category Filter Dropdown */}
      <Form.Group className="mb-3">
        <Form.Label>Filter by Category:</Form.Label>
        <Form.Select value={selectedCategory} onChange={handleCategoryChange} style={{ width: '200px' }}>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </Form.Select>
      </Form.Group>

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
              <td>${book.price.toFixed(2)}</td>
              <td>
                <Button variant="success" onClick={() => handleAddToCart(book)}>
                  Add to Cart
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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

      {/* Pagination */}
      <Pagination>
        {Array.from({ length: Math.ceil(filteredBooks.length / booksPerPage) }).map(
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

      {/* Offcanvas Cart (Side Cart) */}
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
          <Button variant="success" className="mt-3" onClick={() => setShowCart(false)}>
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
