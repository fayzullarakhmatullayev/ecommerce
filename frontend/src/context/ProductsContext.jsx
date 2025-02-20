import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { ProductService } from '../services/ProductService';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  const fetchProducts = async (filters = {}) => {
    try {
      setLoading(true);
      const { category, minPrice, maxPrice, search, page = 1, limit } = filters;
      const params = new URLSearchParams();

      if (category && category !== 'all') {
        params.append('category', category);
      }
      if (minPrice !== undefined) {
        params.append('minPrice', minPrice);
      }
      if (maxPrice !== undefined) {
        params.append('maxPrice', maxPrice);
      }
      if (search) {
        params.append('search', search);
      }
      if (limit) {
        params.append('limit', limit);
      }
      params.append('page', page);

      const data = await ProductService.fetchProducts(params);
      setProducts(data.products);
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages
      });
      setError(null);
      return data;
    } catch {
      setError('Failed to fetch products');
      setProducts([]);
      setPagination({ currentPage: 1, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id) => {
    try {
      setLoading(true);
      const data = await ProductService.getProductById(id);
      setError(null);
      return data;
    } catch {
      setError('Failed to fetch product');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        getProductById,
        fetchProducts,
        pagination
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

ProductsProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
