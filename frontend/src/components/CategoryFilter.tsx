import React, { useState, useEffect } from 'react';
import { fetchBooks } from '../api/BookAPI';
import { Book } from '../types/Book';

interface CategoryFilterProps {
  category: string | null;
  onCategoryChange: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ category, onCategoryChange }) => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const books: Book[] = await fetchBooks(); // typed explicitly
        const uniqueCategories = Array.from(new Set(books.map((book) => book.category))).sort();
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    getCategories();
  }, []);

  return (
    <div className="mb-4">
      <label htmlFor="categoryFilter" className="form-label"><strong>Filter by Category:</strong></label>
      <select
        id="categoryFilter"
        className="form-select"
        value={category || ''}
        onChange={(e) => onCategoryChange(e.target.value || null)}
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
