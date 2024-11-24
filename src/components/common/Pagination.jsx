import React from "react";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav className="pagination" role="navigation" aria-label="pagination" style={{ marginTop: "5px" }}>
            <ul className="pagination-list">
                {pageNumbers.map((page) => (
                    <li key={page}>
                        <a
                            href="#"
                            className={`pagination-link ${page === currentPage ? "is-current custom-color" : ""}`}
                            aria-label={`Goto page ${page}`}
                            onClick={(e) => {
                                e.preventDefault();
                                onPageChange(page);
                            }}
                        >
                            {page}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination;
