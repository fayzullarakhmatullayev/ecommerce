import axios from '../axios';

export class OrderService {
  static async getOrders(page = 1, limit = 10) {
    const response = await axios.get(`/orders?page=${page}&limit=${limit}`);
    return response.data;
  }

  static async getOrder(id) {
    const response = await axios.get(`/orders/${id}`);
    return response.data;
  }

  static async createOrder(orderData) {
    const response = await axios.post('/orders', orderData);
    return response.data;
  }

  static async cancelOrder(id) {
    const response = await axios.put(`/orders/${id}/cancel`);
    return response.data;
  }

  static async updateOrder(id, updateData) {
    const response = await axios.put(`/orders/${id}`, updateData);
    return response.data;
  }

  static async deleteOrder(id) {
    const response = await axios.delete(`/orders/${id}`);
    return response.data;
  }
}
