import axios from '../axios';

export const CartService = {
  getCart: async () => {
    const response = await axios.get('/cart');
    return response.data;
  },

  addToCart: async (productId, quantity) => {
    const response = await axios.post('/cart', { productId, quantity });
    return response.data;
  },

  updateQuantity: async (itemId, quantity) => {
    const response = await axios.put(`/cart/${itemId}`, { quantity });
    return response.data;
  },

  removeFromCart: async (itemId) => {
    const response = await axios.delete(`/cart/${itemId}`);
    return response.data;
  }
};
