import React, { useState, useEffect } from 'react';
import { Button, Container, Alert } from 'react-bootstrap';
import BookList from '../components/BookList';
import CategoryFilter from '../components/CategoryFilter';
import NewBookForm from '../components/NewBookForm';
import { fetchBooks, addBook, updateBook, deleteBook } from '../api/BookAPI';
import { Book } from '../types/Book';

const Bookstore: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [category, setCategory] = useState<string | null>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCart, setShowCart] = useState(false);
  const [showAlert, setShowAlert] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showForm, setShowForm] = useState(false);

  const booksPerPage = 5;

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const data = await fetchBooks();
      setBooks(data);
      filterBooks(data, category);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const filterBooks = (booksToFilter: Book[], selectedCategory: string | null) => {
    if (!selectedCategory || selectedCategory === 'All') {
      setFilteredBooks(booksToFilter);
    } else {
      setFilteredBooks(booksToFilter.filter((book) => book.category === selectedCategory));
    }
    setCurrentPage(1);
  };

  const handleCategoryChange = (selectedCategory: string | null) => {
    setCategory(selectedCategory);
    filterBooks(books, selectedCategory);
  };

  const handleAddBook = async (newBook: Book) => {
    try {
      await addBook(newBook);
      setShowAlert('Book added successfully!');
      loadBooks();
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleUpdateBook = async (updatedBook: Book) => {
    try {
      await updateBook(updatedBook.bookId, updatedBook);
      setShowAlert('Book updated successfully!');
      loadBooks();
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleDeleteBook = async (id: number) => {
    try {
      await deleteBook(id);
      setShowAlert('Book deleted successfully!');
      loadBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Bookstore</h2>

      {showAlert && (
        <Alert variant="success" onClose={() => setShowAlert(null)} dismissible>
          {showAlert}
        </Alert>
      )}

      <CategoryFilter category={category} onCategoryChange={handleCategoryChange} />

      <div className="mb-3 text-end">
        <Button
          variant="primary"
          onClick={() => {
            setEditingBook(null); // Ensure it's in "add" mode
            setShowForm(true);
          }}
        >
          Add New Book
        </Button>
      </div>

      <BookList
        books={currentBooks}
        totalBooks={filteredBooks.length}
        currentPage={currentPage}
        booksPerPage={booksPerPage}
        onPageChange={setCurrentPage}
        onUpdateBook={(book) => {
          setEditingBook(book); // Set the book for editing
          setShowForm(true);
        }}
        onDeleteBook={handleDeleteBook}
        showCart={showCart}
        toggleCart={() => setShowCart(!showCart)}
      />

      {/* Add/Edit Book Form Modal */}
      <NewBookForm
        show={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingBook(null);
        }}
        editingBook={editingBook}
        onAddBook={handleAddBook}
        onUpdateBook={handleUpdateBook}
      />
    </Container>
  );
};

export default Bookstore;
