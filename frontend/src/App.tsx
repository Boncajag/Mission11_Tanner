import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Bookstore from './pages/Bookstore';
import Cart from './pages/Cart';

const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <div className="container mt-3">
          {/* Navigation Bar */}
          <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/">
                Bookstore
              </Link>
              <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      Book List
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/cart">
                      Cart
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          {/* Define Routes */}
          <Routes>
            <Route path="/" element={<Bookstore />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
