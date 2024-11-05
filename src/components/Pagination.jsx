import React from "react";

const Pagination = () => {
    return (
        <nav class="pagination" role="navigation" aria-label="pagination" style={{marginTop:'5px'}}>
            <ul class="pagination-list">
                <li>
                <a
                    class="pagination-link is-current"
                    aria-label="Page 1"
                    aria-current="page"
                    >1</a
                >
                </li>
                <li>
                <a href="#" class="pagination-link" aria-label="Goto page 2">2</a>
                </li>
                <li>
                <a href="#" class="pagination-link" aria-label="Goto page 3">3</a>
                </li>
            </ul>
        </nav>
    );
} 

export default Pagination;