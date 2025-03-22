import React, { useState, useEffect } from 'react';
import { Table, Pagination, Form } from 'react-bootstrap';
import { FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';
import { Book } from './types/Book';

// Define the BookList component
const BookList: React.FC = () => {
  // State to hold the list of books fetched from the API
  const [books, setBooks] = useState<Book[]>([]);

  // State to manage the current page in pagination
  const [currentPage, setCurrentPage] = useState<number>(1);

  // State to set how many books to display per page
  const [booksPerPage, setBooksPerPage] = useState<number>(5);

  // State to determine sort order: true for ascending, false for descending
  const [sortAscending, setSortAscending] = useState<boolean>(true);

  // Fetch books from the API when the component loads
  useEffect(() => {
    fetch('https://localhost:7234/api/Bookstore') // Fetch from API URL
      .then((response) => response.json()) // Convert response to JSON
      .then((data) => setBooks(data)) // Update books state with fetched data
      .catch((error) => console.error('Error fetching books:', error)); // Handle errors
  }, []);

  // Sort books by title in ascending or descending order
  const sortedBooks = [...books].sort((a, b) => {
    return sortAscending
      ? a.title.localeCompare(b.title) // Ascending order
      : b.title.localeCompare(a.title); // Descending order
  });

  // Calculate the index of the last book on the current page
  const indexOfLastBook = currentPage * booksPerPage;

  // Calculate the index of the first book on the current page
  const indexOfFirstBook = indexOfLastBook - booksPerPage;

  // Get the books to be displayed on the current page
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);

  // Change the page when a pagination button is clicked
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle changes in the "Results per page" dropdown
  const handleResultsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBooksPerPage(Number(e.target.value)); // Update books per page
    setCurrentPage(1); // Reset to page 1 after changing results per page
  };

  // Toggle between ascending and descending sort order
  const toggleSortOrder = () => setSortAscending(!sortAscending);

  return (
    <div className="container mt-4">
      {/* Page Title */}
      <h2 className="mb-3 text-center">📚 Book List</h2>

      {/* Sort Button */}
      <button className="btn btn-primary mb-3" onClick={toggleSortOrder}>
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

      {/* Books Table */}
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
          </tr>
        </thead>
        <tbody>
          {/* Render each book as a table row */}
          {currentBooks.map((book) => (
            <tr key={book.bookId}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
              <td>{book.isbn}</td>
              <td>{book.classification}</td>
              <td>{book.pageCount}</td>
              <td>{book.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Results Per Page Dropdown */}
      <Form.Group className="mb-3">
        <Form.Label>Results per page:</Form.Label>
        <Form.Select
          value={booksPerPage}
          onChange={handleResultsPerPageChange}
          style={{ width: '150px' }}
        >
          {/* Dropdown options to set books per page */}
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </Form.Select>
      </Form.Group>

      {/* Pagination Buttons */}
      <Pagination>
        {Array.from({ length: Math.ceil(books.length / booksPerPage) }).map(
          (_, index) => (
            <Pagination.Item
              key={index + 1} // Use index as key
              onClick={() => paginate(index + 1)} // Go to selected page
              active={index + 1 === currentPage} // Highlight active page
            >
              {index + 1} {/* Display page number */}
            </Pagination.Item>
          )
        )}
      </Pagination>
    </div>
  );
};

export default BookList;
