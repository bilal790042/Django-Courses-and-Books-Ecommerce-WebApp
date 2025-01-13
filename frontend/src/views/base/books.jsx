import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BaseHeader from '../partials/BaseHeader';
import BaseFooter from '../partials/BaseFooter';

const Books = () => {
  const [books, setBooks] = useState([]); // State to store books
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [booksPerPage] = useState(4); // Number of books per page
  const [searchQuery, setSearchQuery] = useState(""); // Search state

  // Placeholder for fetching books data from backend
  const fetchBooks = () => {
    // Example books data (Replace this with API data)
    const dummyBooks = [
        { id: 1, title: "JavaScript Essentials", author: "John Doe", price: 19.99, image: "https://images.unsplash.com/photo-1542744095-ec74d8f1cd2f", reviews: 120, rating: 4.5 },
  { id: 2, title: "React for Beginners", author: "Jane Smith", price: 25.99, image: "https://images.unsplash.com/photo-1573496761370-90972ccbd1ae", reviews: 90, rating: 4.8 },
  { id: 3, title: "Advanced Node.js", author: "Alex Green", price: 30.99, image: "https://images.unsplash.com/photo-1505917694262-6dbb354d72eb", reviews: 70, rating: 4.3 },
  { id: 4, title: "Understanding React Hooks", author: "Lily Brown", price: 22.99, image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68", reviews: 110, rating: 4.7 },
  { id: 5, title: "Mastering Python", author: "Mark White", price: 19.99, image: "https://images.unsplash.com/photo-1585900133303-3a7de54c1847", reviews: 150, rating: 5 },
  { id: 6, title: "Data Science with R", author: "Sophia Blue", price: 24.99, image: "https://images.unsplash.com/photo-1573497602064-b7b14e5d60ef", reviews: 80, rating: 4.4 },
  { id: 7, title: "The Full Stack Developer", author: "James Black", price: 35.99, image: "https://images.unsplash.com/photo-1604585487343-4c1ac39cfc87", reviews: 65, rating: 4.2 },
  { id: 8, title: "Machine Learning Essentials", author: "Emily Pink", price: 27.99, image: "https://images.unsplash.com/photo-1593642532754-0bb6f2f5c2f0", reviews: 130, rating: 4.9 },
    ];
    setBooks(dummyBooks);
  };

  useEffect(() => {
    fetchBooks(); // Fetch books data on component load
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery)
  );

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  return (
    <>
            <BaseHeader />
    <section className='mb-5'>
      <div className="container mb-lg-8">
        <div className="row mb-5 mt-3">
          <div className="col-12">
            <div className="mb-6">
              <h2 className="mb-1 h1">📚 Explore Our Books</h2>
              <p>Discover the best books in various categories to expand your knowledge.</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search for books..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
              {/* Hardcoded static data for books */}
              {currentBooks.map((book) => (
                <div className="col" key={book.id}>
                  <div className="card card-hover">
                    <Link to={`/book-detail/${book.title.replace(/\s+/g, '-').toLowerCase()}/`}>
                      <img
                        src={book.image}
                        alt="book"
                        className="card-img-top"
                        style={{ width: "100%", height: "200px", objectFit: "cover" }}
                      />
                    </Link>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <span className="badge bg-info">Technology</span>
                          <span className="badge bg-success ms-2">{book.author}</span>
                        </div>
                        <a href="#" className="fs-5">
                          <i className="fas fa-heart text-danger align-middle" />
                        </a>
                      </div>
                      <h4 className="mb-2 text-truncate-line-2">
                        <Link
                          to={`/book-detail/${book.title.replace(/\s+/g, '-').toLowerCase()}/`}
                          className="text-inherit text-decoration-none text-dark fs-5"
                        >
                          {book.title}
                        </Link>
                      </h4>
                      <small>By: {book.author}</small> <br />
                      <small>{book.reviews} Reviews</small>
                      <br />
                      <div className="lh-1 mt-3 d-flex">
                        <span className="align-text-top">
                          <span className="fs-6">
                            <span className="text-warning">{book.rating}</span>
                          </span>
                        </span>
                        <span className="fs-6 ms-2">{book.reviews} Reviews</span>
                      </div>
                    </div>
                    <div className="card-footer">
                      <div className="row align-items-center g-0">
                        <div className="col">
                          <h5 className="mb-0">${book.price}</h5>
                        </div>
                        <div className="col-auto">
                          <button type="button" className="text-inherit text-decoration-none btn btn-primary me-2">
                            <i className="fas fa-shopping-cart text-primary text-white" />
                          </button>
                          <Link
                            to={`/book-detail/${book.title.replace(/\s+/g, '-').toLowerCase()}/`}
                            className="text-inherit text-decoration-none btn btn-primary"
                          >
                            View Details <i className="fas fa-arrow-right text-primary align-middle me-2 text-white" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, index) => (
                  <li
                    key={index + 1}
                    className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>

          </div>
        </div>
      </div>
    </section>
    <BaseFooter />
    </>
  );
};

export default Books;
