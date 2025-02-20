import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { OrderService } from '../services/OrderService';
import {
  Spinner,
  Alert,
  Flex,
  Text,
  ButtonGroup,
  Button,
  Box,
  VStack,
  Heading,
  Badge
} from '@chakra-ui/react';
import { useAuth } from '../context';

export const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1
  });

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if ((!user && !loading) || user?.isAdmin) {
      navigate('/');
    }
  }, [user, authLoading, navigate, loading]);

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const data = await OrderService.getOrders(page);
      setOrders(data.orders);
      setPagination({
        page: data.pagination.page,
        totalPages: data.pagination.totalPages
      });
    } catch {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePageChange = (page) => {
    fetchOrders(page);
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      PENDING: 'yellow',
      PROCESSING: 'blue',
      SHIPPED: 'purple',
      DELIVERED: 'green',
      CANCELLED: 'red'
    };
    return colors[status] || 'gray';
  };

  return (
    <Box maxW="container.xl" mx="auto" px={4} py={8}>
      <Heading as="h1" size="xl" mb={6}>
        My Orders
      </Heading>
      {loading && (
        <Flex height="60vh" align="center" justify="center">
          <Spinner size="xl" />
        </Flex>
      )}
      {error && <Alert type="error" message={error} />}
      {orders.length === 0 && !loading ? (
        <Box textAlign="center" py={8}>
          <Text color="gray.500" mb={2}>
            You haven&apos;t placed any orders yet.
          </Text>
          <Link to="/">
            <Button colorScheme="blue" variant="link">
              Start Shopping
            </Button>
          </Link>
        </Box>
      ) : (
        <VStack spacing={4} align="stretch">
          {orders.map((order) => (
            <Box key={order.id} borderWidth="1px" borderRadius="lg" p={4} shadow="sm">
              <Flex justify="space-between" align="start" mb={4}>
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Order #{order.id}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Text>
                </Box>
                <Badge
                  px={3}
                  py={1}
                  borderRadius="full"
                  colorScheme={getStatusBadgeColor(order.status)}
                >
                  {order.status}
                </Badge>
              </Flex>
              <Box mb={4}>
                <Text fontWeight="medium">Total: ${order.total.toFixed(2)}</Text>
                <Text fontSize="sm" color="gray.500">
                  {order.items.length} items
                </Text>
              </Box>
              <Flex justify="flex-end">
                <Link to={`/orders/${order.id}`}>
                  <Button colorScheme="blue">View Details</Button>
                </Link>
              </Flex>
            </Box>
          ))}
          {pagination.totalPages > 1 && (
            <ButtonGroup spacing={2} justifyContent="center">
              <Button
                isDisabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Previous
              </Button>
              <Button
                isDisabled={pagination.page === pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
              </Button>
            </ButtonGroup>
          )}
        </VStack>
      )}
    </Box>
  );
};
