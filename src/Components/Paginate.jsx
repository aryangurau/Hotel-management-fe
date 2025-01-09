import React from 'react';
import PropTypes from 'prop-types';

const Paginate = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxPagesToShow = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  // Adjust start page if we're near the end
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  // Generate page numbers
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination mb-0">
        {/* First page */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
        </li>

        {/* Previous page */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lsaquo;
          </button>
        </li>

        {/* Show ellipsis if there are pages before the start */}
        {startPage > 1 && (
          <li className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        )}

        {/* Page numbers */}
        {pages.map(page => (
          <li
            key={page}
            className={`page-item ${currentPage === page ? 'active' : ''}`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}

        {/* Show ellipsis if there are pages after the end */}
        {endPage < totalPages && (
          <li className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        )}

        {/* Next page */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &rsaquo;
          </button>
        </li>

        {/* Last page */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

Paginate.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
};

export default Paginate;
