import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context';
import {
  ProductList,
  ProductDetail,
  Cart,
  Login,
  Register,
  Profile,
  AdminProductList,
  NotFound,
  AdminProductCreate,
  AdminProductEdit
} from './pages';

import { NavBar, AdminLayout } from './components';
import { Box } from '@chakra-ui/react';

function App() {
  const { user } = useAuth();
  return (
    <Router>
      <Box minH="100vh" width="100%" display="flex" flexDirection="column">
        <NavBar />
        <Box flex="1" width="100%">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/login" replace />}
            />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="products" element={<AdminProductList />} />
              <Route path="products/new" element={<AdminProductCreate />} />
              <Route path="products/edit/:id" element={<AdminProductEdit />} />
              <Route path="categories" element={<div>Categories Page</div>} />
              <Route path="orders" element={<div>Orders Page</div>} />
              <Route index element={<Navigate to="products" replace />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
