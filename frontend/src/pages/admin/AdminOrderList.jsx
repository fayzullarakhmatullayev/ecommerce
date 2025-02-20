import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context';
import { OrderService } from '../../services/OrderService';
import {
  Box,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  useToast,
  Spinner,
  Flex,
  IconButton,
  Select,
  ButtonGroup,
  Button,
  Badge
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

export const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!authLoading && !user?.isAdmin) {
      navigate('/login');
      return;
    }
  }, [user, authLoading, navigate]);

  const fetchOrders = async (page = 1) => {
    try {
      const data = await OrderService.getOrders(page, pageSize);
      setOrders(data.orders);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      toast({
        title: 'Error fetching orders',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 2000,
        isClosable: true
      });
    }
  };

  useEffect(() => {
    if (user?.isAdmin) {
      fetchOrders(currentPage);
    }
  }, [currentPage, user]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await OrderService.updateOrder(orderId, { status: newStatus });
      toast({
        title: 'Order status updated',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
      fetchOrders(currentPage);
    } catch (error) {
      toast({
        title: 'Error updating order',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 2000,
        isClosable: true
      });
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await OrderService.deleteOrder(orderId);
        toast({
          title: 'Order deleted',
          status: 'success',
          duration: 2000,
          isClosable: true
        });
        fetchOrders(currentPage);
      } catch (error) {
        toast({
          title: 'Error deleting order',
          description: error.message || 'Something went wrong',
          status: 'error',
          duration: 2000,
          isClosable: true
        });
      }
    }
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

  if (authLoading)
    return (
      <Flex height="80vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );

  if (!user?.isAdmin) return null;

  return (
    <Container maxW="container.xl" py={8}>
      <Heading size="lg" mb={6}>
        Orders Management
      </Heading>

      <Box bg="white" shadow="md" borderRadius="lg" overflow="hidden">
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Order ID</Th>
                <Th>Date</Th>
                <Th>Customer</Th>
                <Th>Total</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.map((order) => (
                <Tr key={order.id}>
                  <Td>
                    <Link to={`/admin/orders/${order.id}`} style={{ color: 'blue.500' }}>
                      <Badge
                        px={3}
                        py={1}
                        borderRadius="full"
                        colorScheme={getStatusBadgeColor(order.status)}
                      >
                        #{order.id}
                      </Badge>
                    </Link>
                  </Td>
                  <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
                  <Td>{order.user?.name || 'N/A'}</Td>
                  <Td>${order.total.toFixed(2)}</Td>
                  <Td>
                    <Select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      size="sm"
                      width="140px"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </Select>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(order.id)}
                        aria-label="Delete order"
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {totalPages > 1 && (
          <Flex px={4} py={4} justify="center">
            <ButtonGroup spacing={2}>
              <Button
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                isDisabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button size="sm" variant="outline">
                {currentPage} / {totalPages}
              </Button>
              <Button
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                isDisabled={currentPage === totalPages}
              >
                Next
              </Button>
            </ButtonGroup>
          </Flex>
        )}
      </Box>
    </Container>
  );
};
