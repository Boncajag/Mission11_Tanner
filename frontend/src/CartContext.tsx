import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Book } from './types/Book'; // Import the Book type

// Define a CartItem interface that extends Book with a quantity property
interface CartItem extends Book {
  quantity: number; // Add quantity to track the number of copies
}

// Define the structure of the CartContext
interface CartContextType {
  cart: CartItem[]; // Array of items in the cart
  addToCart: (book: Book) => void; // Function to add a book to the cart
  removeFromCart: (id: number) => void; // Function to remove a book from the cart
}

// Create a context with an undefined initial value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Define the CartProvider component that wraps around the application
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize the cart state with items from localStorage if available
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart'); // Get saved cart from localStorage
    return savedCart ? JSON.parse(savedCart) : []; // Parse and return the saved cart or an empty array
  });

  // Function to add a book to the cart
  const addToCart = (book: Book) => {
    setCart((prevCart) => {
      // Check if the book is already in the cart
      const existingItem = prevCart.find((item) => item.bookId === book.bookId);
      let updatedCart;
      if (existingItem) {
        // If book is already in the cart, update its quantity
        updatedCart = prevCart.map((item) =>
          item.bookId === book.bookId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If book is not in the cart, add it with a quantity of 1
        updatedCart = [...prevCart, { ...book, quantity: 1 }];
      }
      // Save the updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart; // Return the updated cart
    });
  };

  // Function to remove a book from the cart
  const removeFromCart = (id: number) => {
    // Filter out the item with the given bookId
    const updatedCart = cart.filter((item) => item.bookId !== id);
    setCart(updatedCart);
    // Update localStorage after removing the item
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Provide cart and cart manipulation functions to child components
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to consume the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  // Throw an error if useCart is used outside of the CartProvider
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
