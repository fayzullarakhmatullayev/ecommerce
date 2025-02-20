import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { OrderService } from '../services/OrderService';
import {
  Spinner,
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  Badge,
  Image
} from '@chakra-ui/react';
import { useAuth } from '../context';
import { STORAGE_URL } from '../constants';

export const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if ((!user && !loading) || user?.isAdmin) {
      navigate('/');
    }
  }, [user, authLoading, navigate, loading]);

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

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await OrderService.getOrder(id);
        setOrder(data);
      } catch {
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    try {
      await OrderService.cancelOrder(id);
      const updatedOrder = await OrderService.getOrder(id);
      setOrder(updatedOrder);
    } catch {
      setError('Failed to cancel order');
    }
  };

  if (loading)
    return (
      <Flex height="60vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  if (error)
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  if (!order)
    return (
      <Alert status="error">
        <AlertIcon />
        Order not found
      </Alert>
    );

  return (
    <Box maxW="container.xl" mx="auto" px={4} py={8}>
      <Box mb={6}>
        <Link to="/orders">
          <Button variant="link" leftIcon={<Text>←</Text>} colorScheme="blue">
            Back to Orders
          </Button>
        </Link>
      </Box>

      <Box bg="white" borderRadius="lg" shadow="sm" p={6}>
        <Flex justify="space-between" align="start" mb={6}>
          <Box>
            <Heading as="h1" size="xl" mb={2}>
              Order #{order.id}
            </Heading>
            <Text color="gray.500">Placed on {new Date(order.createdAt).toLocaleDateString()}</Text>
          </Box>
          <Badge px={4} py={2} borderRadius="full" colorScheme={getStatusBadgeColor(order.status)}>
            {order.status}
          </Badge>
        </Flex>

        <Box borderY="1px" borderColor="gray.200" py={4} mb={6}>
          <Heading as="h2" size="md" mb={4}>
            Items
          </Heading>
          <VStack spacing={4} align="stretch">
            {order.items.map((item) => (
              <Flex key={item.id} align="center">
                <Box flexShrink={0} w="16" h="16">
                  <Image
                    src={STORAGE_URL + item.product.images[0]?.url}
                    alt={item.product.title}
                    objectFit="cover"
                    w="full"
                    h="full"
                    borderRadius="md"
                  />
                </Box>
                <Box ml={4} flex={1}>
                  <Text fontWeight="medium">{item.product.title}</Text>
                  <Text fontSize="sm" color="gray.500">
                    Quantity: {item.quantity} × ${item.price.toFixed(2)}
                  </Text>
                </Box>
                <Box textAlign="right">
                  <Text fontWeight="medium">${(item.quantity * item.price).toFixed(2)}</Text>
                </Box>
              </Flex>
            ))}
          </VStack>
        </Box>

        <Flex justify="space-between" align="center" mb={6}>
          <Text fontSize="lg" fontWeight="semibold">
            Total
          </Text>
          <Text fontSize="lg" fontWeight="semibold">
            ${order.total.toFixed(2)}
          </Text>
        </Flex>

        {order.status === 'PENDING' && (
          <Flex justify="flex-end">
            <Button onClick={handleCancelOrder} colorScheme="red">
              Cancel Order
            </Button>
          </Flex>
        )}
      </Box>
    </Box>
  );
};
