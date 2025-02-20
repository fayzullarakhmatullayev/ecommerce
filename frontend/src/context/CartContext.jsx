import PropTypes from 'prop-types';
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { CartService } from '../services/CartService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  CartProvider.propTypes = {
    children: PropTypes.node.isRequired
  };
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchCart = async () => {
      if (user && !user.isAdmin) {
        try {
          const cartData = await CartService.getCart();
          setCart(cartData);
        } catch (error) {
          console.error('Error fetching cart:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCart();
  }, [user]);

  const addToCart = async (product) => {
    if (!user || user.isAdmin) return;
    try {
      const updatedCart = await CartService.addToCart(product.id, 1);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!user || user.isAdmin) return;
    try {
      const updatedCart = await CartService.removeFromCart(itemId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!user || user.isAdmin || quantity < 1) return;
    try {
      const updatedCart = await CartService.updateQuantity(itemId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = () => {
    setCart({ items: [] });
  };

  const getCartTotal = () => {
    return cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart: cart.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
