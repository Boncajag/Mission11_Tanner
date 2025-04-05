import { Book } from '../types/Book';

const API_BASE_URL = 'https://localhost:7234/api/Bookstore';

// GET all books
export const fetchBooks = async (): Promise<Book[]> => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) throw new Error('Failed to fetch books');
  return await response.json();
};

// GET books by category
export const fetchBooksByCategory = async (category: string): Promise<Book[]> => {
  const response = await fetch(`${API_BASE_URL}/category/${encodeURIComponent(category)}`);
  if (!response.ok) throw new Error('Failed to fetch books by category');
  return await response.json();
};

// GET a book by ID
export const fetchBookById = async (id: number): Promise<Book> => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) throw new Error('Failed to fetch book');
  return await response.json();
};

// POST new book
export const addBook = async (book: Book): Promise<Book> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  if (!response.ok) throw new Error('Failed to add book');
  return await response.json();
};

// PUT update existing book
export const updateBook = async (id: number, book: Book): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Update failed:', errorText);
    throw new Error('Failed to update book');
  }
};

// DELETE a book by ID
export const deleteBook = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Delete failed:', errorText);
    throw new Error('Failed to delete book');
  }
};
