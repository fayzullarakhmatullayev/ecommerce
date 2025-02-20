import axios from '../axios';

export class CartService {
  static async getCart() {
    const response = await axios.get('/cart');
    return response.data;
  }

  static async addToCart(productId, quantity) {
    const response = await axios.post('/cart', { productId, quantity });
    return response.data;
  }

  static async updateQuantity(itemId, quantity) {
    const response = await axios.put(`/cart/${itemId}`, { quantity });
    return response.data;
  }

  static async removeFromCart(itemId) {
    const response = await axios.delete(`/cart/${itemId}`);
    return response.data;
  }
}
