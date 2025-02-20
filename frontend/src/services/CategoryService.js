import axios from '../axios';

export class CategoryService {
  static async getCategories() {
    try {
      const response = await axios.get('/categories');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { success: false, error: error.message };
    }
  }

  static async createCategory(name) {
    try {
      const response = await axios.post('/categories', { name });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating category:', error);
      return { success: false, error: error.message };
    }
  }

  static async updateCategory(id, name) {
    try {
      const response = await axios.put(`/categories/${id}`, { name });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating category:', error);
      return { success: false, error: error.message };
    }
  }

  static async deleteCategory(id) {
    try {
      await axios.delete(`/categories/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting category:', error);
      return { success: false, error: error.message };
    }
  }
}