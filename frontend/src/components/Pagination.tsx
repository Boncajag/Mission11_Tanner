import React from 'react';
import { Pagination } from 'react-bootstrap';

interface PaginationProps {
  booksPerPage: number;
  totalBooks: number;
  currentPage: number;
  paginate: (pageNumber: number) => void;
}

const CustomPagination: React.FC<PaginationProps> = ({
  booksPerPage,
  totalBooks,
  currentPage,
  paginate,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalBooks / booksPerPage); i++) {
    pageNumbers.push(i);
  }

  if (pageNumbers.length <= 1) return null;

  return (
    <Pagination className="justify-content-center mt-3">
      <Pagination.Prev
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {pageNumbers.map((number) => (
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => paginate(number)}
        >
          {number}
        </Pagination.Item>
      ))}
      <Pagination.Next
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === pageNumbers.length}
      />
    </Pagination>
  );
};

export default CustomPagination;
