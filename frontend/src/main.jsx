import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ChakraProvider } from '@chakra-ui/react';
import { ProductsProvider, CartProvider, CategoriesProvider, AuthProvider } from './context';

createRoot(document.getElementById('root')).render(
  <ChakraProvider>
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <CategoriesProvider>
            <App />
          </CategoriesProvider>
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  </ChakraProvider>
);
