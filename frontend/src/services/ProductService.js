import axios from '../axios';

export class ProductService {
  static async fetchProducts(filters = {}) {
    const response = await axios.get('/products', { params: filters });
    return response.data;
  }

  static async getProductById(id) {
    const response = await axios.get(`/products/${id}`);
    return response.data;
  }

  static async createProduct(productData) {
    const response = await axios.post('/products', productData);
    return response.data;
  }

  static async updateProduct(id, productData) {
    const response = await axios.put(`/products/${id}`, productData);
    return response.data;
  }

  static async deleteProduct(id) {
    const response = await axios.delete(`/products/${id}`);
    return response.data;
  }
}
