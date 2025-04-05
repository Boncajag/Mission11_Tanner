import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { Book } from '../types/Book';

interface NewBookFormProps {
  onAddBook: (newBook: Book) => Promise<void>;
  onUpdateBook?: (updatedBook: Book) => Promise<void>;
  editingBook?: Book | null;
  onClose: () => void;
  show: boolean;
}

const NewBookForm: React.FC<NewBookFormProps> = ({
  onAddBook,
  onUpdateBook,
  editingBook,
  onClose,
  show,
}) => {
  const [book, setBook] = useState<Book>({
    bookId: 0,
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    classification: '',
    category: '',
    pageCount: 0,
    price: 0
  });

  useEffect(() => {
    if (editingBook) {
      setBook(editingBook);
    } else {
      setBook({
        bookId: 0,
        title: '',
        author: '',
        publisher: '',
        isbn: '',
        classification: '',
        category: '',
        pageCount: 0,
        price: 0
      });
    }
  }, [editingBook]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: name === 'pageCount' || name === 'price' ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook && onUpdateBook) {
      await onUpdateBook(book);
    } else {
      await onAddBook(book);
    }
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{editingBook ? 'Edit Book' : 'Add New Book'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {['title', 'author', 'publisher', 'isbn', 'classification', 'category'].map((field) => (
            <Form.Group key={field} className="mb-2">
              <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
              <Form.Control
                name={field}
                value={(book as any)[field]}
                onChange={handleChange}
                required
              />
            </Form.Group>
          ))}
          <Form.Group className="mb-2">
            <Form.Label>Page Count</Form.Label>
            <Form.Control
              type="number"
              name="pageCount"
              value={book.pageCount}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={book.price}
              onChange={handleChange}
              required
              step="0.01"
            />
          </Form.Group>
          <Button type="submit" variant="primary">
            {editingBook ? 'Update Book' : 'Add Book'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default NewBookForm;
